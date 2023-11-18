import Link from "next/link";
import { supabase } from "../../lib/supabase";

export default async function Page() {
  const { data } = await supabase.from("workflows").select();

  return (
    <section>
      {data?.map((workflow) => {
        return (
          <article key={workflow.id}>
            <Link href={`/workflows/${workflow.id}`}>{workflow.name}</Link>
          </article>
        );
      })}
    </section>
  );
}
