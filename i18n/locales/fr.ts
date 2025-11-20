import { fr as vFr } from 'vuetify/locale'
import fr from './fr.json'
export default defineI18nLocale(async locale => {
  return {
    ...fr,
    "$vuetify": vFr
  }
})
