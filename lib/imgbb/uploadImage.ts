export async function uploadToImgbb(file: File): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  if (!apiKey) {
    throw new Error("imgbb API key set नहीं है");
  }

  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch("https://api.imgbb.com/1/upload?key=" + apiKey, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (!res.ok || !data?.data?.url) {
    throw new Error(data?.error?.message ?? "Image upload नहीं हो पाई");
  }

  return data.data.url as string;
}
