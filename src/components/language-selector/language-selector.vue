<script>
     import Vue from 'vue';

export default Vue.extend({
  name: 'LanguageSelect',
  mounted() {
    if (this.$cookies.isKey('user_language')) {
      this.$i18n.locale = this.$cookies.get('user_language');
    }
  },
  updated() {
    this.$cookies.set('user_language', this.$i18n.locale);
  },
  data() {
    return {
      languages: [
        {
          id: 'en',
          name: 'English'
        }, {
          id: 'ar',
          name: 'عربى'
        }, {
          id: 'fr',
          name: 'Français'
        }, {
          id: 'pt',
          name: 'Português'
        }, {
          id: 'es',
          name: 'Español'
        }]
    };
  },
});


</script>

<template>
    <div class="hd-element drop-down">
  <select class="language-selector" name="test_select3" v-model="$i18n.locale">
    <option v-for="language in languages" :key="language.id" :value="language.id">
      {{language.name}}
    </option>
  </select>
</div>

</template>