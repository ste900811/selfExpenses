import { getUsers } from "@/lib/mongo/getUsers";

const handler = async (req: any, res: any) => {
  if (req.method === "GET") {
    try {
      const users : any = await getUsers();
      return res.status(200).json({ users });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  res.setHeader("Allow", ["GET"]);
  res.status(425).end(`Method ${req.method} Not Allowed`);
}

export default handler;
