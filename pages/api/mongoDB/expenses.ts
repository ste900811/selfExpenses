import { postExpenses } from "@/lib/mongo/expenses";

const handler = async (req: any, res: any) => {
  
  // if (req.method === "GET") {
  //   try {
  //     const details : any = await getDetails();
  //     return res.status(200).json({ details });
  //   } catch (error: any) {
  //     return res.status(500).json({ error: error.message });
  //   }
  // }

  if (req.method === "POST") {
    try {
      const data = req.body;
      const document = {
        "year": data.year,
        "month": data.month,
        day : [{
          "day" : data.day,
          "category" : data.category, 
          "detail": data.detail, 
          "amount" : data.amount
        }]
      }
      const result = await postExpenses(document);
      return res.status(200).json({ result });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  res.setHeader("Allow", ["POST"]);
  res.status(425).end(`Method ${req.method} Not Allowed`);
}

export default handler;
