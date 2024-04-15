<script setup>
import { onBeforeMount, ref } from 'vue';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import FloatLabel from 'primevue/floatlabel';
import Message from 'primevue/message';
import Textarea from 'primevue/textarea';

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
  const url = import.meta.env.VITE_BACKEND_URL ?? process.env.VITE_BACKEND_URL;

  let response = await fetch(url + '/languages', {
    method: 'GET',
  });

  response = await response.json();

  if (response.status === "ok") {
    languages.value = response.data;
  } else {
    errorMsg.value = "Data couldn' be loaded. Please try again later.";
    hasError.value = true;
  }
});

async function translate()
{
  const url = import.meta.env.VITE_BACKEND_URL ?? process.env.VITE_BACKEND_URL;

  if (!selectedLanguage.value || !textOriginal.value) {
    if (!selectedLanguage.value) {
      targetInvalid.value = true;
    }

    if (!textOriginal.value) {
      textInvalid.value = true;
    }
    
    textTranslated.value = "";
    errorMsg.value = "Please select a target language as well as a text to translate!";
    hasInfo.value = false;
    hasError.value = true;

    return;
  }

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
  } else {
    textTranslated.value = "";
    errorMsg.value = response.error;
    hasError.value = true;
  }
}
</script>

<template>
  <div class="app">
    <h1>Simple Translator App</h1>
    <Message v-if="hasInfo" severity="info">{{ infoMsg }}</Message>
    <Message v-if="hasError" severity="error">{{ errorMsg }}</Message>
    <div class="content">
      <Dropdown v-model="selectedLanguage" :options="languages" optionLabel="name" placeholder="Select a target language" :invalid="targetInvalid" />
      <div class="translation-area">
        <FloatLabel>
          <Textarea v-model="textOriginal" autoResize rows="10" cols="50" :invalid="textInvalid" />
          <label>Text to Translate</label>
        </FloatLabel>
        <Button @click="translate()">Translate</Button>
        <FloatLabel>
          <Textarea v-model="textTranslated" autoResize rows="10" cols="50" readonly />
          <label>Translated Text</label>
        </FloatLabel>
      </div>
    </div>
  </div>
</template>

<style scoped>
.app {
  padding: 20px;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 50px;
}

.translation-area {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 50px;
}

.text-area {
  flex: 1;
}
</style>
