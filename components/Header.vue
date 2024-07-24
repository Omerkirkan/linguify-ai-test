<template>
    <div>
        <nav class="bg-white border-gray-200">
            <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <a href="javascript:void(0)" class="flex items-center space-x-3 rtl:space-x-reverse">
                    <img src="/assets/images/linguify-logo.png" class="h-8" alt="Linguify logo" />
                    <span class="self-center text-2xl font-semibold whitespace-nowrap">Linguify</span>
                </a>
                <button type="button"
                    class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                    aria-controls="navbar-default" aria-expanded="false" @click="toggleMobileMenu()">
                    <span class="sr-only">Open main menu</span>
                    <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                        viewBox="0 0 17 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M1 1h15M1 7h15M1 13h15" />
                    </svg>
                </button>
                <div class="hidden w-full md:block md:w-auto" id="navbar-default">
                    <ul
                        class="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white">
                        <li>
                            <NuxtLink to="/"
                                class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0">
                                Home </NuxtLink>
                        </li>
                        <li>
                            <NuxtLink to="chat"
                                class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0">
                                Chat </NuxtLink>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>




        <div class="fixed top-0 left-0 z-50 w-full h-screen bg-[#595B59] px-4 animate-fade-right animate-duration-300"
            v-if="isMobileMenu">

            <div class="flex justify-between items-center mt-5">

                <div>
                    <a href="javascript:void(0)" class="flex items-center space-x-3 rtl:space-x-reverse">
                        <img src="/assets/images/linguify-logo.png" class="h-8" alt="Linguify logo" />
                        <span class="self-center text-2xl font-semibold whitespace-nowrap">Linguify</span>
                    </a>
                </div>
                <div>
                    <span @click="toggleMobileMenu"> X </span>
                </div>

            </div>

            <div class="mt-10 flex flex-col space-y-8">


                <div class="flex justify-between items-center">
                    <div>
                        <NuxtLink to="/" class="body-regular text-[#FFF]" @click="toggleMobileMenu"> Home
                        </NuxtLink>
                    </div>
                </div>
                <div class="flex justify-between items-center">
                    <div>
                        <NuxtLink to="/chat" class="body-regular text-[#FFF]" @click="toggleMobileMenu"> Chat
                        </NuxtLink>
                    </div>
                </div>

            </div>

        </div>
    </div>
</template>

<script setup>

const isMobileMenu = ref(false);

const toggleMobileMenu = () => {
    isMobileMenu.value = !isMobileMenu.value;
};

</script>