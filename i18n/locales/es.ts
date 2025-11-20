import { es as vEs } from 'vuetify/locale'
import es from './es.json'
export default defineI18nLocale(async locale => {
  return {
    ...es,
    "$vuetify": vEs
  }
})

