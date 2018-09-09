<template>
  <div>
    <v-card-title primary-title :style="'background-color: ' + title_background_color" class="pl-5">
      <div v-if="plain_style">
        <h3 class="mb-0 inspire_title_plain" v-html="title"></h3>
        <div class="inspire_subheading" v-html="subheading"></div>
      </div>
      <div v-else>
        <h3 class="mb-0 inspire_title" v-html="title"></h3>
        <div class="inspire_subheading" v-html="subheading"></div>
      </div>
    </v-card-title>
    <svg v-if="!plain_style" style="transform: translate(0px, -10px);" width="100%" viewBox="0 0 722 58" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <!-- Generator: Sketch 43.1 (39012) - http://www.bohemiancoding.com/sketch -->
        <desc>Created with Sketch.</desc>
        <defs></defs>
        <g id="Welcome" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g id="Desktop-HD" transform="translate(-359.000000, -360.000000)" stroke-width="10" stroke="#2DC4E4" fill="#2DC4E4">
                <g id="Simple_wave_pattern" transform="translate(364.000000, 365.000000)">
                    <g id="y">
                        <g id="x">
                            <path d="M2.2253811,0.923589489 C0.565234192,0.923589489 0.443327094,1.48156025 1.93918052,2.19570775 C1.93918052,2.19570775 26.9810921,13 42.8651231,33 C58.7491541,53 74.8478342,53 91.1611633,33 C107.474492,13 123.573173,13 139.457204,33 C155.341235,53 171.439915,53 187.753244,33 C204.066573,13 220.165253,13 236.049284,33 C251.933315,53 268.031995,53 284.345324,33 C300.658654,13 316.757334,13 332.641365,33 C348.525396,53 364.624076,53 380.937405,33 C397.250734,13 413.349414,13 429.233445,33 C445.117476,53 461.216156,53 477.529485,33 C493.842815,13 509.941495,13 525.825526,33 C541.709557,53 557.808237,53 574.121566,33 C590.434895,13 606.533575,13 622.417606,33 C638.301637,53 654.400317,53 670.713646,33 C687.026976,13 711.606549,1.3591892 711.606549,1.3591892 C712.094615,1.11861412 712.035601,0.923589489 711.494639,0.923589489 L2.2253811,0.923589489 Z" id="w"></path>
                        </g>
                    </g>
                </g>
            </g>
        </g>
    </svg>
  </div>
</template>

<script>
import axios from '~/plugins/axios'
export default {
  props: [ 'title', 'subheading', 'plain_style' ],
  computed: {
    title_background_color: function() {
      if (this.plain_style) return 'transparent'
      else return '#2DC4E4'
    }
  }
}
</script>
