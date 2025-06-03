# Coral-Reef-Capstone

An interactive web application that not only displays graphical representations of coral reef information, but also manages the data of the coral reef tanks. The application will be used in parallel with Apex Fusion in the lab, and displayed on TVS for viewers in the Makerspace. 

## Technologies used:

- [Raspberry Pi](https://www.raspberrypi.org/), [Python](https://www.python.org/), [Cron-Job](https://cron-job.org/)
    The tech stack used to pull data from Apex Fusion in the Coral Reef Lab and push it to the server at regular intervals

- [xml2js](https://www.npmjs.com/package/xml2js)
    A package used to convert data from Apex Fusion from XML format to JSON format

- [MySQL Relational Database](https://www.mysql.com/)
    The database used to store data pulled from Apex Fusion 

- [Drizzle](https://orm.drizzle.team/)
    An ORM used to query data from the database, chosen for its more lightweight and SQL-centric approach

- [HTML/JS/CSS](https://developer.mozilla.org/en-US/docs/Web/HTML) with [Tailwind CSS](https://tailwindcss.com/) framework
    The languages and framework used for visuals and styling within the UI

- [Headless UI](https://headlessui.dev/)
    A library used for building accessible menu components – works seamlessly with Tailwind CSS

- [Heroicons](https://heroicons.com/)
    SVG icons that work well with Tailwind CSS

- [Next.js](https://nextjs.org/)
    A React framework used to build full stack web applications

- [Vercel](https://vercel.com/)
    A cloud platform used to deploy web applications – integrates seamlessly with Next.js
    
- [Recharts](https://recharts.org/), [D3](https://d3js.org/)
    The libraries used for creation of graphical visuals

- [AG Grid](https://www.ag-grid.com/)
    A library for handling large datasets, customizable rows, and pagination

- [flatpickr](https://reactdatepicker.com/)
    A React package used for date selection features, including datetime filtering
    
- [Auth0](https://auth0.com/)
    An authorization and authentication service

- [Axios](https://www.npmjs.com/package/axios)
    A promise-based HTTP client that simplifies making API requests in React application

- [Google Sheets](https://workspace.google.com/products/sheets/)
    Used for the database backup, with tabs to keep track of recenty backed-up data and soft-deleted data

- [Google App Scripts](https://developers.google.com/apps-script)
    Used alongside Google Sheets for database backups (not in sync with the Cron Job)

## Installation and Setup

### Prerequisites
- Node.js (v18 or higher)
<!-- - MySQL Server  --> could be outdated
- Python 3.x (for Raspberry Pi scripts)
- Apex Fusion account with access to locally hosted (in the Bergen County Acadmies Makerspace) XML files
- Auth0 account and application setup

### Database Setup
The following is an example database setup readme ...
<!-- The project uses a MySQL database. Since the school-issued MySQL databases will be taken down, you'll need to:

1. Export the database schema and data:
   - The database schema can be found in `/database/schema.sql`
   - Use MySQL Workbench or command line to export the DDL:
   ```bash
   mysqldump -u [username] -p [database_name] > database_backup.sql
   ```

2. Import to your local MySQL server:
   ```bash
   mysql -u [username] -p [database_name] < database_backup.sql
   ``` -->

### Environment Configuration
Create a `.env.local` file in the root directory with the following variables (with real values, do not include the single quotes):
```env
# Database Configuration
DATABASE_URL=mysql://user:password@localhost:3306/coral_reef_db

# Auth0 Configuration
AUTH0_SECRET='your-auth0-secret'
AUTH0_BASE_URL='http://localhost:3000'
AUTH0_ISSUER_BASE_URL='your-auth0-domain'
AUTH0_CLIENT_ID='your-auth0-client-id'
AUTH0_CLIENT_SECRET='your-auth0-client-secret'

# Apex Fusion Configuration
APEX_FUSION_USERNAME='your-apex-username'
APEX_FUSION_PASSWORD='your-apex-password'
APEX_FUSION_URL='your-apex-fusion-url'
```

### Installation Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/Coral-Reef-Capstone.git
   cd Coral-Reef-Capstone
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the Raspberry Pi data collection:
   - Clone the data collection repository:
     ```bash
     git clone https://github.com/vrigue/Coral-Reef-Data-Collection.git
     ```
   - Follow the setup instructions in the repository's README
   - Configure the cron job to run the data collection script at regular intervals

4. Start the development server:
   ```bash
   npm run dev
   ```

### Additional Resources
- The Python scripts for data collection using the Raspberry Pis are maintained in a separate repository: [Coral-Reef-Data-Collection](https://github.com/vrigue/Coral-Reef-Data-Collection)
- Database schema and models are located in `/database/`
- Package dependencies are managed through `package.json`

### Deployment
The application is deployed on Vercel @ [https://bergen-reef-accessing-data-coral-reef-capstone.vercel.app/](https://bergen-reef-accessing-data-coral-reef-capstone.vercel.app/)

### Third-Party Services
1. **Auth0**
   - Authentication and authorization service
   - Configuration required in Auth0 dashboard
   - Environment variables needed (see Environment Configuration)

2. **Apex Fusion**
   - API access required for data collection
   - Credentials needed in environment variables
   - Python scripts handle data collection and transformation

3. **Vercel**
   - TBA

### Requirements Documentation
- Node.js dependencies are managed through `package.json`
- Python dependencies for the Raspberry Pi scripts are listed in the [Coral-Reef-Data-Collection](https://github.com/vrigue/Coral-Reef-Data-Collection) repository

### Configuration Files
- `.env.local` - Environment variables (see sample above)
- `next.config.js` - Next.js configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `drizzle.config.ts` - Database ORM configuration

### Additional Notes
- The application requires a running MySQL server
- The Raspberry Pi must be configured with the correct network access to reach both Apex Fusion and the database server
- Database backups occur separately from the data pushed to the base
- The application is designed to be displayed on TVs in the Makerspace