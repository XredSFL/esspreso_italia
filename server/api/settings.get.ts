// Public settings (promo bar, footer, WhatsApp, logo) for the site shell.
export default defineEventHandler(async () => {
  const rows = await prisma.setting.findMany({ select: { key: true, value: true } })
  return Object.fromEntries(rows.map((r) => [r.key, r.value])) as Record<string, unknown>
})
