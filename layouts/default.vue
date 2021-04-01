<template>
  <v-app dark>

    <v-app-bar :clipped-left="clipped" fixed app dark color="cyan darken-4">

      <v-toolbar-title v-text="title"/>
      <v-spacer />

    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>

    <v-footer :absolute="!fixed" app dark color="cyan darken-4">
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>

  </v-app>
</template>

<script>
export default {
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          to: '/',
        },
      ],
      right: true,
      title: 'Solar App',
    }
  },
}
</script>
