import Image from "next/image";

export function Figure() {
  return <Image
    className="figure"
    src="/brand/identity-original.jpg"
    width={640}
    height={640}
    alt=""
    preload
  />;
}
