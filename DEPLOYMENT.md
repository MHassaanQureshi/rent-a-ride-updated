# Deployment Guide for Rent-a-Ride

## Vercel Deployment

### Prerequisites
- A Vercel account (sign up at https://vercel.com)
- MongoDB Atlas account with a database set up
- Your project pushed to GitHub, GitLab, or Bitbucket

### Step-by-Step Deployment

1. **Push your code to Git repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - ready for deployment"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Go to Vercel Dashboard**
   - Visit https://vercel.com/dashboard
   - Click "Add New..." → "Project"

3. **Import Your Repository**
   - Select your Git provider (GitHub/GitLab/Bitbucket)
   - Choose the rent-a-ride repository
   - Click "Import"

4. **Configure Environment Variables**
   Add the following environment variables in Vercel:

   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   NEXTAUTH_SECRET=<your-secret-key>
   NEXTAUTH_URL=https://your-domain.vercel.app
   ```

   To generate `NEXTAUTH_SECRET`:
   ```bash
   openssl rand -base64 32
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete
   - Your app will be live at `https://your-project-name.vercel.app`

### Important Configuration Notes

#### MongoDB Connection
- Make sure your MongoDB Atlas cluster allows connections from anywhere (0.0.0.0/0) or add Vercel's IP ranges
- Database name is set to "rentcar" in the connection string

#### Image Hosting
- Currently using external images from 'car-rental-website-five.vercel.app'
- For production, consider:
  - Using Vercel Blob Storage
  - Cloudinary
  - AWS S3
  - Or hosting images in your own domain

#### Session Configuration
- NextAuth is configured with JWT strategy
- Session expires based on default NextAuth settings
- Update `NEXTAUTH_URL` to match your production domain

### Post-Deployment Checklist

- [ ] Test user registration and login
- [ ] Test vehicle listing and filtering
- [ ] Test booking creation
- [ ] Test provider dashboard
- [ ] Test user dashboard
- [ ] Verify all environment variables are set correctly
- [ ] Check MongoDB connection is working
- [ ] Test image loading
- [ ] Verify authentication flows

### Troubleshooting Common Issues

**Build Fails**
- Check the build logs in Vercel dashboard
- Ensure all environment variables are set
- Verify MongoDB connection string is correct

**Database Connection Issues**
- Verify MongoDB Atlas IP whitelist includes 0.0.0.0/0
- Check your MongoDB credentials
- Ensure the database name matches ("rentcar")

**Authentication Issues**
- Verify `NEXTAUTH_URL` matches your deployment URL
- Make sure `NEXTAUTH_SECRET` is set
- Check that MongoDB connection is working (NextAuth stores sessions)

**Image Loading Issues**
- Images from external domains need to be configured in next.config.ts
- Current config allows images from 'car-rental-website-five.vercel.app'
- Add additional domains as needed

### Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/` |
| `NEXTAUTH_SECRET` | Secret for JWT encryption | Generated with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Your production URL | `https://your-app.vercel.app` |

### Performance Optimization

- Enable Vercel Analytics (optional)
- Consider enabling Image Optimization
- Set up caching headers for static assets
- Monitor build times and optimize if needed

### Continuous Deployment

Vercel automatically deploys when you push to your main branch:
```bash
git add .
git commit -m "Your changes"
git push
```

Every push triggers a new deployment with preview URL.

### Custom Domain (Optional)

1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Update DNS records as instructed
5. Update `NEXTAUTH_URL` to use your custom domain

### Support

For issues or questions:
- Check Vercel logs in the dashboard
- Review MongoDB Atlas logs
- Check browser console for client-side errors
- Review Next.js documentation: https://nextjs.org/docs
