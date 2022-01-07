export const getIpfsDirectoryInfo = async (directory, ipfsClient) => {
  const links = {}
  const thingsToWaitFor = []
  for await (const l of ipfsClient.ls(directory)) {
    const link = { ...l }
    links[link.name] = link
    link.files = {}
    link.cid = link.cid.toString()
    if (l.type !== "dir" || l.name === undefined) {
      continue
    }

    thingsToWaitFor.push(
      getIpfsDirectoryInfo(link.cid, ipfsClient).then((sublinks) => {
        link.files = { ...sublinks, ...link.files }
      }),
    )
  }
  await Promise.all(thingsToWaitFor)
  return links
}

export const flatten = (directory) => {
  return {
    "data/4-nested/1-nested/cousin.txt": {
      cid: "bafkreiaknttxbghhjdg55tqanaoispulu4m7komya4mvus2naijmsds2bu",
    },
  }
}