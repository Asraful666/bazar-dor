import { getProducts } from "@/lib/api";

export async function GET() {
  try {
    const products = await getProducts();

    return Response.json(products, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return Response.json(
      { message: "পণ্যের দাম লোড করা যায়নি।" },
      { status: 502 }
    );
  }
}