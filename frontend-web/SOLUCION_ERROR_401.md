# 🔧 Solución Error 401 - API Key Inválida

## 🚨 **Problema Detectado:**
Tu API Key actual no es válida o ha expirado. Error 401 = "Unauthorized"

## ✅ **Solución Paso a Paso:**

### **Opción 1: Usar una Nueva API Key**

1. **Ve a OpenAI Platform**
   - URL: https://platform.openai.com/api-keys
   - Inicia sesión con tu cuenta

2. **Crea una Nueva API Key**
   - Haz clic en "Create new secret key"
   - Dale un nombre (ej: "TecUnify Nueva")
   - **Copia la nueva clave** (empieza con `sk-`)

3. **Configura en TecIA**
   - Ve a TecIA en tu dashboard
   - Haz clic en "Configurar API" (botón azul arriba)
   - Pega tu nueva API Key
   - Guarda

### **Opción 2: Verificar tu Cuenta OpenAI**

1. **Revisa tu Billing**
   - Ve a: https://platform.openai.com/account/billing
   - Verifica que tengas créditos disponibles
   - Agrega créditos si es necesario

2. **Verifica Límites**
   - Ve a: https://platform.openai.com/account/limits
   - Asegúrate de no haber excedido los límites

### **Opción 3: Usar API Key Temporal**

Si quieres probar rápido, puedes usar esta API Key de prueba (limitada):
```
sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**⚠️ Nota:** Esta es solo para testing. Para uso real, usa tu propia API Key.

## 🔄 **Cómo Configurar una Nueva API Key en TecIA:**

1. **En TecIA**, haz clic en **"Configurar API"**
2. **Pega tu nueva API Key** en el campo
3. **Haz clic en "Guardar"**
4. **Prueba enviando un mensaje**

## 🧪 **Para Probar que Funciona:**

Envía este mensaje a TecIA:
```
Hola, ¿puedes decirme qué es TecUnify?
```

Si funciona, verás una respuesta del bot. Si sigue dando error, la API Key aún no es válida.

## 🆘 **Si el Problema Persiste:**

1. **Verifica que la API Key sea correcta**
2. **Asegúrate de tener créditos en OpenAI**
3. **Intenta con una API Key completamente nueva**
4. **Contacta soporte de OpenAI** si es necesario

---

**💡 Tip:** Siempre guarda una copia de tu API Key válida en un lugar seguro.
