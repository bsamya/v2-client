<template>
  <div>
    <h1>I18n</h1>
    <p>{{ t('email-required') }}</p>
    <p>{{ t('email-invalid') }}</p>
    <p>{{ t('password-required') }}</p>
    <p>{{ t('password-min-length', { min: 6 }) }}</p>
    <p>{{ t('password-max-length', { max: 20 }) }}</p>
    <p>{{ t('complex-password') }}</p>
    <hr />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
const { t } = useI18n({
  useScope: 'local'
})

const x = computed(() => t('password-min-length', { min: 6 }))
</script>


<i18n lang="json">{
  "en": {
    "email-required": "Email is required",
    "email-invalid": "Email is invalid",
    "password-required": "Password is required",
    "password-min-length": "password must be at least {min} characters",
    "password-max-length": "password must be at most {max} characters",
    "complex-password": "Password must include at least one uppercase letter, one lowercase letter, and one number"
  },
  "fr": {
    "email-required": "L'email est requis",
    "email-invalid": "L'email n'est pas valide",
    "password-required": "Le mot de passe est requis",
    "password-min-length": "Le mot de passe doit contenir au moins {min} caractères",
    "password-max-length": "Le mot de passe doit contenir au maximum {max} caractères",
    "complex-password": "Le mot de passe doit inclure au moins une lettre majuscule, une lettre minuscule et un chiffre"
  },
  "es": {
    "email-required": "El correo electrónico es obligatorio",
    "email-invalid": "El correo electrónico no es válido",
    "password-required": "La contraseña es obligatoria",
    "password-min-length": "La contraseña debe tener al menos {min} caracteres",
    "password-max-length": "La contraseña debe tener como máximo {max} caracteres",
    "complex-password": "La contraseña debe incluir al menos una letra mayúscula, una letra minúscula y un número"
  }
}</i18n>
