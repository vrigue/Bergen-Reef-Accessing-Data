# Coral-Reef-Capstone

An interactive web application that not only displays graphical representations of coral reef information, but also manages the data of the coral reef tanks. The application will be used in parallel with Apex Fusion in the lab, and displayed on TVS for viewers in the Makerspace. 

## Technologies used:

- [ESP32](http://esp32.net/), [CircuitPython](https://circuitpython.org/), [Cron-Job](https://cron-job.org/)
    The tech stack used to pull data from Apex Fusion in the Coral Reef Lab and push it to the server at regular intervals

- [xml2js] (https://www.npmjs.com/package/xml2js)
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