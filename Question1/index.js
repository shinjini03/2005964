const express=require('express');
const axios=require('axios');
const index= express();
const port= 3000;

index.get('/numbers',async(req,res)=> {
    const { url }= req.query;

    if(!url){
        return res.status(400).json({ error: 'Please provide at least one url'});
    }
    const urls= Array.isArray(url) ? url : [url];

    try{
        const result= await Promise.all(
            urls.map(async (link) => {
                try{
                    const response = await axios.get(link);
                    const numbers = extractNumbers(response.data);
                    return numbers;
                } catch(error){
                    return `Error fetching numbers from ${link}: ${error.message}`;
                }
            })
        );
        res.json({ data:result });
    } catch(error){
        res.status(500).json({ error : 'Internal server error'});
    }
});

function extractNumbers(htmlContent){
    const regex = /\d+/g;
    return htmlContent.match(regex);
}

index.listen(port,() => {
    console.log(`Microservice is running on http://localhost:${port}`);
});