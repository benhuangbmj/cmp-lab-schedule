const spaceId = import.meta.env.VITE_SPACE_ID;
const cmaToken = import.meta.env.VITE_CMA_TOKEN;

const getSingleAsset = async function(assetId) {
  let asset = await fetch(`https://api.contentful.com/spaces/${spaceId}/environments/master/assets/${assetId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cmaToken}`,
      }
    });
  asset = await asset.json();
  return asset;
}

export {getSingleAsset};