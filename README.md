# Coral-Reef-Capstone

An interactive web application that not only displays graphical representations of coral reef information, but also manages the data of the coral reef tanks. The application will be used in parallel with Apex Fusion in the lab, and displayed on TVS for viewers in the Makerspace. 

## Technologies used:

- [MySQL Relational Database](https://www.mysql.com/)
    The database we are using to store data pulled from Apex Fusion 

- [Drizzle](https://orm.drizzle.team/)
    ORM used to query data in the database, chosen for its more lightweight and SQL-centric approach

- [Cron-Job](https://cron-job.org/) and [Raspberry Pi](https://www.raspberrypi.org/)
    Used to pull data from Apex Fusion/the machines in the Coral Reef Lab and deposit it in the database at regular intervals

- [xml2js] (https://www.npmjs.com/package/xml2js)

- [HTML/JS/CSS](https://developer.mozilla.org/en-US/docs/Web/HTML) with [Tailwind CSS](https://tailwindcss.com/) framework
    Visuals and styling within the UI

- [Headless UI](https://headlessui.dev/)
    Works seamlessly with Tailwind CSS for building accessible menu components

- [Heroicons](https://heroicons.com/)
    SVG icons that work well with Tailwind

- [Next.js](https://nextjs.org/)
    React framework used to build full stack web applications

- [Vercel]
    
- [Recharts](https://recharts.org/)
    Used for creation of graphical visuals

- [AG Grid](https://www.ag-grid.com/)
    Used to handle large datasets, customizable rows, and pagination

- [D3]

- [flatpickr](https://reactdatepicker.com/)
    Advanced date selection features, including datetime filtering
    
- [Auth0](https://auth0.com/)
    Authentication technology