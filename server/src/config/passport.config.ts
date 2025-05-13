import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile as GoogleProfile,
} from "passport-google-oauth20";
import {
  Strategy as FacebookStrategy,
  Profile as FacebookProfile,
} from "passport-facebook";
import {
  Strategy as GitHubStrategy,
  Profile as GitHubProfile,
} from "passport-github";
import prisma from "./prisma.config";

const findOrCreateUser = async (
  profile: GoogleProfile | FacebookProfile | GitHubProfile
) => {
  const { id, emails, photos, provider, displayName } = profile;
  const email = emails?.[0]?.value ?? null;

  try {
    const whereFilter = email
      ? {
          OR: [{ [`${provider}Id`]: profile.id }, { username: email }],
        }
      : {
          [`${provider}Id`]: profile.id,
        };

    const existingUser = await prisma.user.findFirst({
      where: whereFilter,
    });

    if (existingUser) {
      const user = await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          [`${provider}Id`]: id,
          username: email as string,
          image: photos?.[0]?.value,
          displayName,
        },
      });
      return user;
    }
    return await prisma.user.create({
      data: {
        [`${provider}Id`]: id,
        username: email as string,
        image: photos?.[0]?.value,
        displayName,
      },
    });
  } catch (err) {
    console.error("Error finding or creating user:", err);
    throw err;
  }
};

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: `/api/user/login/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await findOrCreateUser(profile as GoogleProfile);
        done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID as string,
      clientSecret: process.env.FACEBOOK_APP_SECRET as string,
      callbackURL: "/api/user/login/facebook/callback",
      enableProof: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await findOrCreateUser(profile as FacebookProfile);
        done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      callbackURL: "/api/user/login/github/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await findOrCreateUser(profile as GitHubProfile);
        done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);

export default passport;
