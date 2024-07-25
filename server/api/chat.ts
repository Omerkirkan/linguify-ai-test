import ollama from 'ollama';

export default eventHandler(async (event) => {

    const chatContextString = await readBody(event);
  
    const messages = JSON.parse(chatContextString);

    const response = await ollama.chat({
        model: 'llama3',
        messages: messages,
        stream: true
    });

    const stream = new ReadableStream({
        async pull(controller) {
            try {
                for await (const chunk of response) {
                    controller.enqueue(chunk.message.content);
                }
                controller.close();
            } catch (error) {
                console.error('Stream error:', error);
                controller.error(error);
            }
        }
    });

    return sendStream(event, stream);
})