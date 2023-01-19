<template>

  <div class="content-centered">
    <div class="methodology">
      <div class="methodology-title page-title">{{ $t('methodology.text') }}</div>
      <div class="content">
        <p class="header-bold"> {{ $t('methodology.title1') }} </p>
        <p>{{ $t('methodology.paragraph1') }}</p>
        <br>
        <p class="sub-header"> {{ $t('methodology.bulletin.title') }} </p>
        <ul class="list-with-bullets">
          <li>
            {{ $t('methodology.bulletin.line1') }}
          </li>
          <li>
            {{ $t('methodology.bulletin.line2') }}
          </li>
          <li>
            {{ $t('methodology.bulletin.line3') }}
          </li>
        </ul>
        <p>
          {{ $t('methodology.paragraph2') }}
          <a
            href="/indicators_info"
            class="link link-blue"> {{ $t('methodology.seeHere') }} </a>
        </p>
        <p class="header-bold"> {{ $t('methodology.title2') }} </p>
        <p>
          {{ $t('methodology.paragraph3Start') }}
          <a
            href="http://wdi.worldbank.org/tables"
            target="_blank"
            class="link-blue">
            {{ $t('methodology.paragraph3Link') }}
          </a>
          {{ $t('methodology.paragraph3End') }}
        </p>

        <p class="header-bold"> {{ $t('methodology.title3') }} </p>
        <p>
          {{ $t('methodology.paragraph4') }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
  import common from '../../common/common';

  export default {
    name: 'Methodology',
    mounted() {
      common.hideLoading();
    }
  };
</script>
