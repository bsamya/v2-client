import { en as vEn } from 'vuetify/locale'
import en from './en.json'
export default defineI18nLocale(async locale => {
  return {
    ...en,
    "$vuetify": vEn
  }
})
