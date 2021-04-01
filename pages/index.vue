<template>
    <v-card
        elevation="24"
        class="mx-auto my-12"
        max-width="750"
    >
        <v-card-title><h5>Query Form</h5></v-card-title>
        <v-card-subtitle><i>Search NCDC stations using this form:</i></v-card-subtitle>
        <v-card-text>
            <v-form id="check-query-form" @submit.prevent="query">
                <v-container>
                <v-row>
                    <v-col
                        cols="6"
                        sm="6"
                    >
                    <v-text-field
                        v-model="latitude"
                        filled
                        label="Latitude"
                        clearable
                    ></v-text-field>
                    </v-col>

                    <v-col
                        cols="6"
                        sm="6"
                    >
                    <v-text-field
                        v-model="longitude"
                        filled
                        label="Longitude"
                        clearable
                    ></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                <v-col
                    cols="6"
                    lg="6"
                >
                <v-menu
                    ref="menu1"
                    v-model="menu1"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="auto"
                >
                <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                        v-model="startDateFormatted"
                        filled
                        label="Start Date"
                        hint="MM/DD/YYYY format"
                        persistent-hint
                        prepend-icon="mdi-calendar"
                        v-bind="attrs"
                        @blur="date1 = parseDate(startDateFormatted)"
                        v-on="on"
                    ></v-text-field>
                </template>
                <v-date-picker
                    v-model="date1"
                    no-title
                    @input="menu1 = false"
                ></v-date-picker>
                </v-menu>
                </v-col>

                <v-col
                    cols="6"
                    lg="6"
                >
                <v-menu
                    ref="menu2"
                    v-model="menu2"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="auto"
                >
                <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                        v-model="endDateFormatted"
                        filled
                        label="End Date"
                        hint="MM/DD/YYYY format"
                        persistent-hint
                        prepend-icon="mdi-calendar"
                        v-bind="attrs"
                        @blur="date2 = parseDate(endDateFormatted)"
                        v-on="on"
                    ></v-text-field>
                </template>
                <v-date-picker
                    v-model="date2"
                    no-title
                    @input="menu2 = false"
                ></v-date-picker>
                </v-menu>
                </v-col>
                </v-row>
                </v-container>
            </v-form>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                dark
                rounded
                color="cyan darken-4"
                depressed
                elevation="4"
                x-large
                form="check-query-form"
                @click="query"
            > Query </v-btn>
            <v-spacer></v-spacer>
        </v-card-actions>
    </v-card>
</template>

<script>

export default {
  components: {},

  data: vm => ({
      date1: new Date().toISOString().substr(0, 10),
      date2: new Date().toISOString().substr(0, 10),
      startDateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
      endDateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
      menu1: false,
      menu2: false,
      latitude: '',
      longitude: '',
  }),

  computed: {
      computedDateFormatted () {
          return this.formatDate(this.date1)
      },
  },

  watch: {
    date1 (val) {
      this.startDateFormatted = this.formatDate(this.date1)
    },
    date2 (val) {
      this.endDateFormatted = this.formatDate(this.date2)
    },
  },

  methods: {
    query (){
        console.log("Sending user query input...")
        this.$router.push({ name: 'station', params: { lat: this.latitude, lng: this.longitude, start: this.date1, end: this.date2 } });
    },
    formatDate (date) {
      if (!date) return null

      const [year, month, day] = date.split('-')
      return `${month}/${day}/${year}`
    },
    parseDate (date) {
      if (!date) return null

      const [month, day, year] = date.split('/')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    },
  },


}
</script>
