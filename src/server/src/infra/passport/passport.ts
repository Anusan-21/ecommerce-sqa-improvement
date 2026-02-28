import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { Strategy as TwitterStrategy } from "passport-twitter";
import { Profile } from "passport";
import prisma from "@/infra/database/database.config";
import {
  generateAccessToken,
  generateRefreshToken,
} from "@/shared/utils/auth/tokenUtils";

export default function configurePassport() {
  // Google Strategy (unchanged)
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL:
          process.env.NODE_ENV === "production"
            ? process.env.GOOGLE_CALLBACK_URL_PROD!
            : process.env.GOOGLE_CALLBACK_URL_DEV!,
      },
      async (
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: any
      ) => {
        try {
          let user = await prisma.user.findUnique({
            where: { email: profile.emails![0].value },
          });

          if (user) {
            if (!user.googleId) {
              user = await prisma.user.update({
                where: { email: profile.emails![0].value },
                data: {
                  googleId: profile.id,
                  avatar: profile.photos![0]?.value || "",
                },
              });
            }
          } else {
            user = await prisma.user.create({
              data: {
                email: profile.emails![0].value,
                name: profile.displayName,
                googleId: profile.id,
                avatar: profile.photos![0]?.value || "",
              },
            });
          }

          const id = user.id;
          const newAccessToken = generateAccessToken(id);
          const newRefreshToken = generateRefreshToken(id);

          return done(null, {
            ...user,
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          });
        } catch (error) {
          console.error("Google Strategy error:", error);
          return done(error);
        }
      }
    )
  );

  // Facebook Strategy (unchanged, assuming it works)
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID!,
        clientSecret: process.env.FACEBOOK_APP_SECRET!,
        callbackURL:
          process.env.NODE_ENV === "production"
            ? process.env.FACEBOOK_CALLBACK_URL_PROD!
            : process.env.FACEBOOK_CALLBACK_URL_DEV!,
        profileFields: ["id", "emails", "name"],
      },
      async (
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: any
      ) => {
        console.log("facebook profile: ", profile);
        try {
          let user = await prisma.user.findUnique({
            where: { email: profile.emails?.[0]?.value || "" },
          });

          if (user) {
            if (!user.facebookId) {
              user = await prisma.user.update({
                where: { email: profile.emails?.[0]?.value || "" },
                data: {
                  facebookId: profile.id,
                  avatar: profile.photos?.[0]?.value || "",
                },
              });
            }
          } else {
            user = await prisma.user.create({
              data: {
                email: profile.emails?.[0]?.value || "",
                name: `${profile.name?.givenName} ${profile.name?.familyName}`,
                facebookId: profile.id,
                avatar: profile.photos?.[0]?.value || "",
              },
            });
          }

          const id = user.id;
          const newAccessToken = generateAccessToken(id);
          const newRefreshToken = generateRefreshToken(id);

          return done(null, {
            ...user,
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          });
        } catch (error) {
          console.error("Facebook Strategy error:", error);
          return done(error);
        }
      }
    )
  );

 
}
