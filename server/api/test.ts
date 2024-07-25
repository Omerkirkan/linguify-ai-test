export default eventHandler(async (event) => {


    const currentDate = new Date();

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Hello from the serverless API!',
            timestamp: currentDate.toISOString(),
        }),
    }
    
})