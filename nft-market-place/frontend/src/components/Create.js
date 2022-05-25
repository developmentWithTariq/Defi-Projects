import { useState } from 'react'
import { ethers } from "ethers"
import { Row, Form, Button } from 'react-bootstrap'
import { create as ipfsHttpClient } from 'ipfs-http-client'
const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

// const pinataApiKey = "695c0cebe9c414c5c8f7";
// const pinataSecretApiKey = "dcd3c355c12cac816838d0123aebbd17cc60b75a9b310ea81b474396c74f4bd5";
// const axios = require("axios");
// const fs = require("fs");
// const FormData = require("form-data");
// const pinFileToIPFS = async (file) => {
//   const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
//   let data = new FormData();
//   data.append("file", fs.createReadStream());
//   const res = await axios.post(url, data, {
//     maxContentLength: "Infinity", 
//     headers: {
//       "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
//       pinata_api_key: pinataApiKey, 
//       pinata_secret_api_key: pinataSecretApiKey,
//     },
//   });
//   console.log(res.data);
// };





const Create = ({ marketplace, nft }) => {
  const [image, setImage] = useState('')
  const [price, setPrice] = useState(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const uploadToIPFS = async (event) => {
    event.preventDefault()
    const file = event.target.files[0]
    
    if (typeof file !== 'undefined') {
      try {
        // pinFileToIPFS(file);
        const result = await client.add(file)
        console.log(result)
        setImage(`https://ipfs.infura.io/ipfs/${result.path}`)
      } catch (error){
        console.log("ipfs image upload error: ", error)
      }
    }
  }
  const createNFT = async () => {
    if (!image || !price || !name || !description) return
    try{
      const result = await client.add(JSON.stringify({image, price, name, description}))
      mintThenList(result)
    } catch(error) {
      console.log("ipfs uri upload error: ", error)
    }
  }
  const mintThenList = async (result) => {
    const uri = `https://ipfs.infura.io/ipfs/${result.path}`
    // mint nft 
    await(await nft.mint(uri)).wait()
    // get tokenId of new nft 
    const id = await nft.tokenCount()
    // approve marketplace to spend nft
    await(await nft.setApprovalForAll(marketplace.address, true)).wait()
    // add nft to marketplace
    const listingPrice = ethers.utils.parseEther(price.toString())
    await(await marketplace.makeItem(nft.address, id, listingPrice)).wait()
  }
  return (
    <div className="container-fluid mt-5">
      <div className="row">
        <main role="main" className="col-lg-12 mx-auto " style={{ maxWidth: '100vh', minHeight:'100vh' }}>
          <div className="content mx-auto">
            <Row className="g-4"  >
              <Form.Control
                type="file"
                required
                name="file"
                onChange={uploadToIPFS}
              />
              <Form.Control onChange={(e) => setName(e.target.value)} size="lg" required type="text" placeholder="Name" />
              <Form.Control onChange={(e) => setDescription(e.target.value)} size="lg" required as="textarea" placeholder="Description" />
              <Form.Control onChange={(e) => setPrice(e.target.value)} size="lg" required type="number" placeholder="Price in ETH" />
              <div className="d-grid px-0">
                <Button onClick={createNFT} variant="primary" size="lg">
                  Create & List NFT!
                </Button>
              </div>
            </Row>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Create