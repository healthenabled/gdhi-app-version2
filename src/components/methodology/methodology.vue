<template>
  <div class="content-centered">
    <div class="methodology">
      <div class="methodology-title page-title">
        {{ $t("methodology.text") }}
      </div>
      <div class="content">
        <p class="header-bold">{{ $t("methodology.title1") }}</p>
        <p>{{ $t("methodology.paragraph1") }}</p>
        <br />
        <p class="sub-header">{{ $t("methodology.bulletin.title") }}</p>
        <ul class="list-with-bullets">
          <li>
            {{ $t("methodology.bulletin.line1") }}
          </li>
          <li>
            {{ $t("methodology.bulletin.line2") }}
          </li>
          <li>
            {{ $t("methodology.bulletin.line3") }}
          </li>
        </ul>
        <p>
          {{ $t("methodology.paragraph2") }}
          <a href="/indicators_info" class="link link-blue">
            {{ $t("methodology.seeHere") }}
          </a>
        </p>
        <p class="header-bold">{{ $t("methodology.title2") }}</p>
        <p>
          {{ $t("methodology.paragraph3Start") }}
          <a
            href="http://wdi.worldbank.org/tables"
            target="_blank"
            class="link-blue"
          >
            {{ $t("methodology.paragraph3Link") }}
          </a>
          {{ $t("methodology.paragraph3End") }}
        </p>

        <p class="header-bold">{{ $t("methodology.title3") }}</p>
        <p>
          {{ $t("methodology.paragraph4") }}
        </p>
        <p class="header-bold">{{ $t("methodology.title4") }}</p>
        <p>
          {{ $t("methodology.paragraph5") }}
        </p>
        <br />
        <p class="sub-header">
          {{ $t("methodology.indicators.bulletin.title") }}
        </p>
        <ul class="list-with-bullets">
          <li>
            {{ $t("methodology.indicators.bulletin.line1") }}
          </li>
          <li>
            {{ $t("methodology.indicators.bulletin.line2") }}
          </li>
          <li>
            {{ $t("methodology.indicators.bulletin.line3") }}
          </li>
          <li>
            {{ $t("methodology.indicators.bulletin.line4") }}
          </li>
          <li>
            {{ $t("methodology.indicators.bulletin.line5") }}
          </li>
          <li>
            {{ $t("methodology.indicators.bulletin.line6") }}
          </li>
          <li>
            {{ $t("methodology.indicators.bulletin.line7") }}
          </li>
          <li>
            {{ $t("methodology.indicators.bulletin.line8") }}
          </li>
        </ul>
        <p>
          {{ $t("methodology.indicators.paragraph.start") }}
          <a
            href="https://www.worldbank.org/en/programs/govtech/gtmi"
            target="_blank"
            class="link-blue"
          >
            {{ $t("methodology.indicators.paragraph.govTech") }}</a
          >
          {{ $t("methodology.indicators.paragraph.GTMI") }},
          {{ $t("methodology.indicators.paragraph.the") }}
          <a
            href="https://networkreadinessindex.org/"
            target="_blank"
            class="link-blue"
          >
            {{ $t("methodology.indicators.paragraph.NRI") }}</a
          >,

          {{ $t("methodology.indicators.paragraph.the") }}
          <a
            href="https://www.mobileconnectivityindex.com/connectivityIndex.html"
            target="_blank"
            class="link-blue"
          >
            {{ $t("methodology.indicators.paragraph.GCI") }}</a
          >,
          {{ $t("methodology.indicators.paragraph.andThe") }}
          <a
            href="https://www.mobileconnectivityindex.com/connectivityIndex.html"
            target="_blank"
            class="link-blue"
          >
            {{ $t("methodology.indicators.paragraph.GSMA") }}</a
          >.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import common from "../../common/common";

export default {
  name: "Methodology",
  mounted() {
    common.hideLoading();
  },
};
</script>
