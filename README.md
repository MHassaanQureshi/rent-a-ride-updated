#  Rent-a-Ride – Full Stack Car Rental App

Rent-a-Ride is a full-stack car rental service built with **Next.js**, **Tailwind CSS**, **MongoDB**, **Mongoose**, **NextAuth.js**, and **shadcn/ui**. It allows users to browse available rides, book rentals, and manage their bookings through a sleek and responsive interface.

---


- **Frontend**: Next.js (App Router), Tailwind CSS, shadcn/ui
- **Backend**: Next.js API routes, MongoDB, Mongoose
- **Auth**: NextAuth.js (Google or Email-based)
- **Styling**: Tailwind + shadcn components

---


Follow these instructions to get the app running on your local machine.

---


cd rent-a-ride
install dependencies
npm install
# or
yarn install


set up .env.local file

# MongoDB
MONGODB_URL=mongodb+srv://<username>:<password>@cluster0.ksogz0t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

# NextAuth
NEXTAUTH_SECRET=your_nextauth_secret
to get NEXTAUTH_SECRET run command : openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000

For Shadcn run:
npx shadcn@latest init
npx shadcn@latest add calendar

For Mongoose:
    npm install mongoose
npm run dev
# or
yarn dev
