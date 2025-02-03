import { MercadoPagoConfig, Preference } from "mercadopago";

export const MP = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN as string,
});

export const api = {
  submit: async ({ user_id }: { user_id: string }) => {
    const preference = await new Preference(MP).create({
      body: {
        items: [{ id: "1", title: "Pago único de matrícula", unit_price: 0, quantity: 1 }],
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_BASE_URL}/loading-data`,
          failure: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/athlete/payments`,
        },
        auto_return: "approved",
        metadata: { user_id },
      },
    });
    return preference.init_point;
  },
};
