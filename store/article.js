import axios from 'axios'

const API_URL = 'https://cat-fact.herokuapp.com/'

export const state = () => ({
    articles: []
})

export const action = {
    async getAllArticles ({ commit }) {
        const articles = await axios.get('${API_URL}/facts/')
        console.log(articles)
        commit('set', articles)
    }
}

export const mutations = {
    set (state, articles) {
        state.articles = articles
    },
}