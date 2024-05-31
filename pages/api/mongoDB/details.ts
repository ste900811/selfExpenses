import { getDetails, postDetail } from "@/lib/mongo/details";

const handler = async (req: any, res: any) => {
  
  if (req.method === "GET") {
    try {
      const details : any = await getDetails();
      return res.status(200).json({ details });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === "POST") {
    try {
      const data = req.body;
      const result = await postDetail({"detail": data.detail});
      return res.status(200).json({ result });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(425).end(`Method ${req.method} Not Allowed`);
}

export default handler;
