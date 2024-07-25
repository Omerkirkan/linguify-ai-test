<template>
    <div class="container">
        <div class="flex flex-col justify-between">
            <div id="heighedBox" class="overflow-scroll">
                <ul>

                    <li v-for="(chat, index) in chatContent" :key="index">
                        <h1 class="font-bold" v-if="chat.role === 'user'"> You </h1>
                        <h1 class="font-bold" v-else> AI </h1>
                        <div class="ml-5" v-html="chat.content"></div>
                        <div v-if="chat.role === 'assistant'" class="h-[0.5px] w-full bg-gray-500 mt-3"></div>
                    </li>

                    <li>
                        <div v-if="loading"> loading.. </div>
                        <div v-else v-if="aiAnswer">
                            <h1 class="font-bold"> AI </h1>
                            <div class="ml-5" v-html="aiAnswer"></div>
                        </div>
                    </li>


                </ul>

            </div>
            <div class="w-full space-y-5">
                <div class="flex">
                    <textarea v-model="prompt" rows="3" class="border-[1px] border-solid border-blue-900 w-full py-1 px-3" @keyup.enter="handleSend()"></textarea>
                    <button @click="handleSend()" class="h-14 px-6 border-2 border-blue-900 border-solid"> Send
                    </button>
                </div>
                <div class="flex justify-end">
                    <button @click="handleDownloadChat()" class="py-1 px-6 border-2 border-blue-900 border-solid">
                        Download Chat
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import type IChatContent from './models/IChatContent';

const chatContent = ref<IChatContent[]>([]);
const prompt = ref('');
const aiAnswer = ref('');
const loading = ref(false);


const handleSend = () => {

    if (!prompt.value) {
        return;
    }

    loading.value = true;

    chatContent.value.push({
        role: 'user',
        content: prompt.value,
    });


    fetch('http://209.38.188.205:3000/api/chat',
        {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(chatContent.value),
        }
    )
        .then((response) => {
            loading.value = false;
            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            const read = () => {
                reader?.read().then(({ done, value }) => {
                    if (done) {

                        chatContent.value.push({
                            role: 'assistant',
                            content: aiAnswer.value,
                        });

                        aiAnswer.value = '';
                        prompt.value = '';
                        return;
                    }
                    aiAnswer.value += decoder.decode(value, { stream: true });
                    read();
                }).catch((err) => {
                    console.error('Stream read error:', err);
                });
            };

            read();
        })
        .catch((err) => {
            console.error('Fetch error:', err);
        });
};

// calculate the height of the chat box
onMounted(() => {
    const heightedBox = document.getElementById('heighedBox');
    if (heightedBox) {
        heightedBox.style.height = `${window.innerHeight - 200}px`;
    }
})

const handleDownloadChat = () => {
    const element = document.createElement('a');
    const file = new Blob([JSON.stringify(chatContent.value)], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'chat.json';
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
}

</script>