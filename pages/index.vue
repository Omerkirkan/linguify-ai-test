<template>
    <div class="container">
        <div class="flex flex-col justify-between">
            <div v-if="resultAIComplated">
                <div class="flex justify-center">
                    <h1 class="text-2xl font-bold"> Your score is </h1>
                </div>
                <div class="flex justify-center">
                    <p> {{ resultAI }} </p>
                </div>
            </div>
            <div v-else>
                <div>
                    <div class="flex justify-end">
                        <button @click="handleGenerateExercise()"
                            class="py-1 px-6 border-2 border-blue-900 border-solid">
                            Generate a exercise
                        </button>
                    </div>
                </div>
                <div id="heighedBox" class="overflow-scroll">
                    <ul>
                        <li>
                            <div v-if="loading"> loading.. </div>
                            <div v-else v-if="aiAnswer">
                                <h1 class="font-bold"> AI </h1>
                                <div class="ml-5" v-html="aiAnswer"></div>
                            </div>
                        </li>


                    </ul>

                </div>
            </div>
            <div class="w-full space-y-5" v-if="isTextActive">
                <div class="flex">
                    <textarea v-model="prompt" rows="3"
                        class="border-[1px] border-solid border-blue-900 w-full py-1 px-3"
                        @keyup.enter="handleSend()"></textarea>
                    <button @click="handleSend()" class="h-14 px-6 border-2 border-blue-900 border-solid"> Send
                    </button>
                </div>
            </div>
        </div>
    </div>
    <div v-if="bigLoading"
        class="fixed inset-0 bg-gray-800 bg-opacity-50 flex flex-col items-center justify-center z-50">
        <div class="w-16 h-16 border-4 border-t-4 border-gray-300 border-solid rounded-full animate-spin"></div>
        <div class="mt-5">
            <p> Please don't refresh the page </p>
        </div>
    </div>
    <div>
        <button @click="getDate()"> Get date </button>
    </div>
</template>
<script lang="ts" setup>
import type IChatContent from './models/IChatContent';
import context from '@/data/chat-1.json'

const chatContent = ref<IChatContent[]>([]);
const prompt = ref('');
const aiAnswer = ref('');
const loading = ref(false);
const isTextActive = ref(false);
const bigLoading = ref(false);
const resultAI = ref('');
const resultAIComplated = ref(false);


const handleGenerateExercise = () => {
    loading.value = true;


    chatContent.value = [
        ...context,
    ];


    fetch('/api/chat',
        {
            method: "post",
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

                        isTextActive.value = true;
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
}

const handleSend = () => {

    if (!prompt.value) {
        return;
    }

    bigLoading.value = true;

    chatContent.value = [
        ...chatContent.value,
        {
            role: 'user',
            content: "Could you evaluate the summary of the practice text that I will write shortly and give me a score out of 100?",
        },
        {
            role: 'user',
            content: prompt.value,
        },

    ];

    fetch('/api/chat',
        {
            method: "post",
            body: JSON.stringify(chatContent.value),
        }
    )
        .then((response) => {
            const reader = response.body?.getReader();
            const decoder = new TextDecoder();            

            const read = () => {
                reader?.read().then(({ done, value }) => {
                    if (done) {
                        bigLoading.value = false;
                        resultAIComplated.value = true;
                        isTextActive.value = false;
                        return resultAI.value;
                    }
                    resultAI.value += decoder.decode(value, { stream: true });
                    read();
                }).catch((err) => {
                    console.error('Stream read error:', err);
                });
            };

            read();
        })
        .catch((err) => {
            console.error('Fetch error:', err);
            bigLoading.value = false;
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

const getDate = () => {
    fetch('/api/test')
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
        });
}

</script>
<style>
@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>