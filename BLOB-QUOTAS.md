# Verificación de Cuotas de Vercel Blob

Este documento describe cómo verificar y gestionar las cuotas del store de Vercel Blob.

---

## Cuotas del Plan Hobby (noviembre de 2026)

Según la documentación de Vercel:

| Recurso                   | Cuota Mensual         | Notas                       |
| ------------------------- | --------------------- | --------------------------- |
| Almacenamiento            | 1 GB                  | Acumulativo                 |
| Operaciones simples       | 10,000                | Lecturas, listados          |
| Operaciones avanzadas     | 2,000                 | Cada subida cuenta una      |
| Tamaño máximo por archivo | 5 GB (límite técnico) | Recomendado: 5MB para fotos |

**Importante:** Si se excede la cuota:

- No se cobra automáticamente
- Se **pierde el acceso a Blob por 30 días**
- No se pueden subir nuevos archivos

---

## Cómo Verificar Cuotas

### 1. Vercel Dashboard

1. Ir a [Vercel Dashboard](https://vercel.com/dashboard)
2. Seleccionar el proyecto
3. Ir a **Storage** → **Blob**
4. Ver el panel de uso (Storage, Operations, etc.)

### 2. Vercel CLI

```bash
# Listar stores
vercel blob ls

# Ver detalles de un store
vercel blob inspect <store-name>

# Listar archivos en un store
vercel blob ls <store-name>
```

### 3. API de Vercel

```bash
# Usar la API de Vercel para obtener métricas
curl -H "Authorization: Bearer $VERCEL_TOKEN" \
  https://api.vercel.com/v1/storage/blobs
```

---

## Medidas de Protección Implementadas

### En el Código

1. **Validación de tamaño de archivo** (`src/services/foto-service.ts`):
   - Máximo 5MB por foto
   - Tipos permitidos: JPEG, PNG, WebP

2. **Reducción de imagen en navegador** (`src/services/foto-service.ts`):
   - Reducción a 400px de ancho
   - Calidad 0.8 (80%)
   - Reduce el tamaño de almacenamiento

3. **Subida directa desde navegador** (`src/hooks/usePhotoUpload.ts`):
   - Evita el límite de 4.5MB por petición de Vercel
   - Usa `upload()` de `@vercel/blob/client`

4. **Validación de pathname** (`app/api/upload/route.ts`):
   - Verifica que el pathname empiece por `usuarios/<uid>/`
   - Previene subidas no autorizadas

### En el Desarrollo

1. **No subir archivos en bucles** durante las pruebas
2. **Borrar archivos de prueba** después de cada sesión
3. **Usar imágenes pequeñas** para pruebas (no fotos de alta resolución)
4. **Monitorear el uso** en el dashboard de Vercel

---

## Limpieza de Archivos de Prueba

### Script de Limpieza

```bash
# Listar archivos en el store
vercel blob ls <store-name>

# Eliminar un archivo específico
vercel blob rm <url> --token $BLOB_READ_WRITE_TOKEN

# Eliminar todos los archivos de prueba (cuidado!)
vercel blob ls <store-name> | grep "test" | xargs -I {} vercel blob rm {} --token $BLOB_READ_WRITE_TOKEN
```

### En el Código

El servicio `foto-service.ts` incluye `eliminarFoto()` que:

- Verifica que el archivo pertenezca al usuario
- Usa `del()` de `@vercel/blob` para eliminar

---

## Monitoreo Recomendado

### Alertas

Configurar alertas en Vercel para:

- Uso de almacenamiento > 80% (800MB)
- Operaciones avanzadas > 80% (1,600/mes)
- Operaciones simples > 80% (8,000/mes)

### Revisión Periódica

- **Semanal:** Revisar el dashboard de Vercel Blob
- **Mensual:** Verificar que no se acerque a los límites
- **Antes de cada despliegue:** Limpiar archivos de prueba

---

## Checklist de Verificación

- [ ] Store de Vercel Blob creado con `--access private`
- [ ] `BLOB_READ_WRITE_TOKEN` configurado solo en servidor
- [ ] Validación de tamaño (máx 5MB) implementada
- [ ] Reducción de imagen en navegador implementada
- [ ] Validación de pathname implementada
- [ ] Limpieza de archivos de prueba documentada
- [ ] Monitoreo de cuotas configurado
- [ ] Alertas configuradas en Vercel (opcional)

---

## Referencias

- [Vercel Blob Documentation](https://vercel.com/docs/storage/vercel-blob)
- [Vercel Blob Private Storage](https://vercel.com/docs/storage/vercel-blob/private-storage)
- [Vercel Blob Client SDK](https://vercel.com/docs/storage/vercel-blob/client-upload)
- Documento del curso: Sección 9.5 "Archivos con Vercel Blob"
- `ESTANDARES.md` - Item 15.12 "Tiendas de Blob revisadas para no exceder cuotas"
