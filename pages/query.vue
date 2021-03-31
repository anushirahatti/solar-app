<template>
    <v-card
        elevation="24"
        outlined
        class="mx-auto my-12"
        max-width="500"
    >
        <v-card-title>QUERY FORM</v-card-title>
        <v-card-subtitle>Search NCDC stations using this form:</v-card-subtitle>
        <v-card-text>
            <v-form>
                <v-container>
                <v-row>
                    <v-col
                        cols="6"
                        sm="6"
                    >
                    <v-text-field
                        v-model="message1"
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
                        v-model="message2"
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
                        v-model="dateFormatted"
                        filled
                        label="Start Date"
                        hint="MM/DD/YYYY format"
                        persistent-hint
                        prepend-icon="mdi-calendar"
                        v-bind="attrs"
                        @blur="date = parseDate(dateFormatted)"
                        v-on="on"
                    ></v-text-field>
                </template>
                <v-date-picker
                    v-model="date"
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
                        v-model="dateFormatted"
                        filled
                        label="End Date"
                        hint="MM/DD/YYYY format"
                        persistent-hint
                        prepend-icon="mdi-calendar"
                        v-bind="attrs"
                        @blur="date = parseDate(dateFormatted)"
                        v-on="on"
                    ></v-text-field>
                </template>
                <v-date-picker
                    v-model="date"
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
                color="cyan darken-4"
                depressed
                elevation="24"
                large
            > Query </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>

export default {
  components: {},

  data: vm => ({
      date: new Date().toISOString().substr(0, 10),
      dateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
      menu1: false,
      menu2: false,
      message1: '',
      message2: '',
  }),

  computed: {
      computedDateFormatted () {
          return this.formatDate(this.date)
      },
  },

  watch: {
    date (val) {
      this.dateFormatted = this.formatDate(this.date)
    },
  },

  methods: {
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