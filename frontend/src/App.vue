<script setup>
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import FloatLabel from 'primevue/floatlabel';
import Message from 'primevue/message';
import Textarea from 'primevue/textarea';
import { onBeforeMount, ref } from 'vue';

const url = import.meta.env.VITE_BACKEND_URL;

const selectedLanguage = ref('');
const languages = ref([]);

const textOriginal = ref('');
const textTranslated = ref('');

const targetInvalid = ref(false);
const textInvalid = ref(false);

const hasError = ref(false);
const hasInfo = ref(false);

const errorMsg = ref('');
const infoMsg = "Someone already requested this translation in the past!";

onBeforeMount(async function() {
  try {
    let response = await fetch(url + '/languages', {
      method: 'GET',
    });

    response = await response.json();

    if (response.status === "ok") {
      languages.value = response.data;
    } else if (response.status === "error") {
      throw Error(response.error);
    } else {
      throw Error(response);
    }
  } catch (e) {
    errorMsg.value = "Languages couldn' be loaded. Please try again later.";
    hasError.value = true;

    console.log(e);
  }
});

async function translate()
{
  if (!validateTranslationRequest()) {
    return;
  }

  try {
    let response = await fetch(url + '/translate', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "text": textOriginal.value,
        "target": selectedLanguage.value.code
      }),
    });

    response = await response.json();

    if (response.status === "ok") {
      hasError.value = false;
      targetInvalid.value = false;
      textInvalid.value = false;

      if (response.data.existing) {
        hasInfo.value = true;
      } else {
        hasInfo.value = false;
      }

      textTranslated.value = response.data.translations;
    } else if (response.status === "error") {
      throw Error(response.error);
    } else {
      throw Error(response);
    }
  } catch (e) {
    errorMsg.value = "Translation failed. Please try again later.";
    hasError.value = true;

    console.log(e);
  }
}

/**
 * Validate if text and target is set.
 */
function validateTranslationRequest()
{
  if (!selectedLanguage.value || !textOriginal.value) {
    if (!selectedLanguage.value) {
      targetInvalid.value = true;
    }

    if (!textOriginal.value) {
      textInvalid.value = true;
    }
    
    errorMsg.value = "Please select a target language as well as a text to translate!";
    hasInfo.value = false;
    hasError.value = true;

    return false;
  }

  return true;
}
</script>

<template>
  <div class="flex flex-column h-full p-4 surface-100">
    <header class="flex align-items-center gap-3">
      <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" fill="currentColor" class="bi bi-globe" viewBox="0 0 16 16">
        <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m7.5-6.923c-.67.204-1.335.82-1.887 1.855A8 8 0 0 0 5.145 4H7.5zM4.09 4a9.3 9.3 0 0 1 .64-1.539 7 7 0 0 1 .597-.933A7.03 7.03 0 0 0 2.255 4zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a7 7 0 0 0-.656 2.5zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5zM8.5 5v2.5h2.99a12.5 12.5 0 0 0-.337-2.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5zM5.145 12q.208.58.468 1.068c.552 1.035 1.218 1.65 1.887 1.855V12zm.182 2.472a7 7 0 0 1-.597-.933A9.3 9.3 0 0 1 4.09 12H2.255a7 7 0 0 0 3.072 2.472M3.82 11a13.7 13.7 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5zm6.853 3.472A7 7 0 0 0 13.745 12H11.91a9.3 9.3 0 0 1-.64 1.539 7 7 0 0 1-.597.933M8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855q.26-.487.468-1.068zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.7 13.7 0 0 1-.312 2.5m2.802-3.5a7 7 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7 7 0 0 0-3.072-2.472c.218.284.418.598.597.933M10.855 4a8 8 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4z"/>
      </svg>
      <h1>Simple Translator App</h1>
    </header>
    <div>
      <Message v-if="hasInfo" severity="info">{{ infoMsg }}</Message>
      <Message v-if="hasError" severity="error">{{ errorMsg }}</Message>
    </div>
    <Dropdown v-model="selectedLanguage" :options="languages" optionLabel="name" placeholder="Select a target language" :invalid="targetInvalid" class="mb-6" />
    <div class="flex-grow-1 flex flex-column overflow-auto">
      <div class="flex flex-wrap justify-content-center align-items-center gap-8 row-gap-6">
        <FloatLabel>
          <Textarea v-model="textOriginal" rows="6" cols="35" autoResize :invalid="textInvalid" />
          <label>Enter text</label>
        </FloatLabel>
        <Button @click="translate()" class="p-button-lg font-bold">Translate!</Button>
        <FloatLabel>
          <Textarea v-model="textTranslated" rows="6" cols="35" autoResize readonly />
          <label>Translation</label>
        </FloatLabel>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
