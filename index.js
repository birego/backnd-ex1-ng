import express from 'express';
import axios from 'axios';

const app = express();
const port = process.env.PORT || 3000;

app.get('/api/hello', async (req, res) => {
    const vName = req.query.visitor_name || 'Visitor';
    let clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    try {
        const ipInfo = await axios.get(`http://ip-api.com/json/${clientIp}`);
        console.log(`IP Info: ${JSON.stringify(ipInfo.data)}`);
            
        if (ipInfo.data.status === 'fail') {
            throw new Error(`Failed to retrieve IP information: ${ipInfo.data.message}`);
        }

        const { city } = ipInfo.data;
        const weather = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=9c605d02b7a4491dc019a005bfe334e8&units=metric`);
        const temperature = weather.data.main.temp;
        res.json({
            client_ip: clientIp,
            location: city,
            greeting: `Hello, ${vName}!, the temperature is ${temperature} degrees Celsius in ${city}`
        });
    } catch (error) {
        console.error('Error retrieving information:', error.message);
        res.status(500).send('Error retrieving information');
    }
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
