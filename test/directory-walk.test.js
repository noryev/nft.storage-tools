import { getIpfsDirectoryInfo } from "../lib/directory-upload.js";
import { create } from "ipfs-http-client";

const IPFS_URL = process.env.IPFS_URL || "https://dweb.link/api/v0";
describe("Directory Walking in IPFS", () => {
  describe("directoryWalk", () => {
    it("should exist", () => {
      expect(getIpfsDirectoryInfo).toBeDefined();
    });
  });
  describe("given an ipfs client", () => {
    let ipfs;
    beforeAll(() => {
      ipfs = create(IPFS_URL);
    });
    describe("given a known directory in ipfs (containing the node_modules of this project, as a matter of fact)", () => {
      let dirinfo;

      beforeAll(async () => {
        const node_modules_cid = "bafybeidl7ozkgaya4jb6tt3ey5t7pw7uefjfdirwfnnplrim2ksw7a4doi";
        dirinfo = await getIpfsDirectoryInfo(node_modules_cid, ipfs);
        console.log(JSON.stringify(dirinfo, null, 2))
      });

      it("should return an array with 1 folder", () => {
        expect(dirinfo.size).toEqual(1);
      });

      it("should be a directory called 'data'", () => {
        const dir = dirinfo["data"]
        expect(dir.name).toEqual("data");
        expect(dir.type).toEqual("dir");       
      });
      
      it("should have 4 files in it", () => {
        const dir = dirinfo["data"]
        expect(Object.keys(Object.keys(dir.files).length)).toHaveLength(3);
      });
    });
    xdescribe("given a different directory in ipfs", () => {
      let dirinfo;

      beforeEach(async () => {
        const jest_module_cid = "bafybeiam7xjs4jhpfegy5z7ob5a4ad2lifj53minvaobelhhsx7ksq6wwa";
        dirinfo = await getIpfsDirectoryInfo(jest_module_cid, ipfs);
      });

      it("should return an array with 11 folders", () => {
        expect(dirinfo.size).toEqual(11);
      });

      it("should have a directory named 'console'", () => {
        const dir = dirinfo.get("console");
        expect(dir.name).toEqual("console");
        expect(dir.type).toEqual("dir");
      });
    });
  });
});