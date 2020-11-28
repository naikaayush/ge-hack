/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';
/**
 * Write your transction processor functions here
 */

/**
* Track the trade of a commodity from one trader to another
* @param {orange.medicalblocks.Trade} trade - the trade to be processed
* @transaction
*/
async function tradeCommodity(trade) {
  trade.commodity.owner = trade.newOwner;
  let assetRegistry = await getAssetRegistry('orange.medicalblocks.Commodity');
  await assetRegistry.update(trade.commodity);
}

/**
* Send invoice to an insurance provider
* @param {orange.medicalblocks.SendInvoice} sendInvoice
* @transaction
*/
async function sendInvoice(sendInvoice) {
	sendInvoice.invoice.currentProvider = sendInvoice.newProvider
  	let assetRegistry = await getAssetRegistry('orange.medicalblocks.Invoice');
 	await assetRegistry.update(sendInvoice.invoice);
}

/**
* Grant Access to medical and insurance recrods
* @param {orange.medicalblocks.GrantAccess} grantAccess
* @transaction
*/
async function grantAccessToRecord(grantAccess) {
	if (grantAccess.mRecord != null) {
    	if (grantAccess.hospital != null) {
          	if (!grantAccess.mRecord.hospitalsWithAccess) {
            	grantAccess.mRecord.hospitalsWithAccess = [grantAccess.hospital];
            } else {
        		grantAccess.mRecord.hospitalsWithAccess.push(grantAccess.hospital);
            }
        }
    	if (grantAccess.iProvider != null) {
          	if (!grantAccess.mRecord.providersWithAccess) {
            	grantAccess.mRecord.providersWithAccess = [grantAccess.iProvider];
            } else {
        		grantAccess.mRecord.providersWithAccess.push(grantAccess.iProvider);
            }
        }
        if (grantAccess.dCenter != null) {
          	if (!grantAccess.mRecord.dCentersWithAccess) {
            	grantAccess.mRecord.dCentersWithAccess = [grantAccess.dCenter];
            } else {
        		grantAccess.mRecord.dCentersWithAccess.push(grantAccess.dCenter);
            }
        }
        let assetRegistry = await getAssetRegistry('orange.medicalblocks.MedicalRecord');
        await assetRegistry.update(grantAccess.mRecord);
    }
  	if (grantAccess.iRecord != null) {
    	if (grantAccess.hospital != null) {
          	if (!grantAccess.iRecord.hospitalsWithAccess) {
            	grantAccess.iRecord.hospitalsWithAccess = [grantAccess.hospital];
            } else {
        		grantAccess.iRecord.hospitalsWithAccess.push(grantAccess.hospital);
            }
        }
    	if (grantAccess.iProvider != null) {
        	// TODO: return error here
          	console.log("Cannot provide insurance details to another provider");
        }
        if (grantAccess.dCenter != null) {
          	if (!grantAccess.iRecord.dCentersWithAccess) {
            	grantAccess.iRecord.dCentersWithAccess = [grantAccess.dCenter];
            } else {
        		grantAccess.iRecord.dCentersWithAccess.push(grantAccess.dCenter);
            }
        }
        let assetRegistry = await getAssetRegistry('orange.medicalblocks.InsuranceRecord');
        await assetRegistry.update(grantAccess.iRecord);
    }
}

/**
* Remove Access from medical or insurance recrods
* @param {orange.medicalblocks.RemoveAccess} removeAccess
* @transaction
*/
async function removeAccessFromRecord(grantAccess) {
	if (grantAccess.mRecord != null) {
    	if (grantAccess.hospital != null) {
          	if (!grantAccess.mRecord.hospitalsWithAccess) {
            	// TODO: throw error
              	console.log("Cannot remove because it does not exist");
            } else {
        		grantAccess.mRecord.hospitalsWithAccess = grantAccess.mRecord.hospitalsWithAccess.filter((item) => item !== grantAccess.hospital);
            }
        }
    	if (grantAccess.iProvider != null) {
          	if (!grantAccess.mRecord.providersWithAccess) {
            	// TODO: throw error
              	console.log("Cannot remove because it does not exist");
            } else {
                grantAccess.mRecord.providersWithAccess = grantAccess.mRecord.providersWithAccess.filter((item) => item !== grantAccess.iProvider);
            }
        }
        if (grantAccess.dCenter != null) {
          	if (!grantAccess.mRecord.dCentersWithAccess) {
            	// TODO: throw error
              	console.log("Cannot remove because it does not exist");
            } else {
                grantAccess.mRecord.dCentersWithAccess = grantAccess.mRecord.dCentersWithAccess.filter((item) => item !== grantAccess.dCenter);
            }
        }
        let assetRegistry = await getAssetRegistry('orange.medicalblocks.MedicalRecord');
        await assetRegistry.update(grantAccess.mRecord);
    }
  	if (grantAccess.iRecord != null) {
    	if (grantAccess.hospital != null) {
          	if (!grantAccess.iRecord.hospitalsWithAccess) {
            	// TODO: throw error
              	console.log("Cannot remove because it does not exist");
            } else {
                grantAccess.iRecord.hospitalsWithAccess = grantAccess.mRecord.hospitalsWithAccess.filter((item) => item !== grantAccess.hospital);
            }
        }
    	if (grantAccess.iProvider != null) {
        	// TODO: return error here
          	console.log("Cannot provide insurance details to another provider");
        }
        if (grantAccess.dCenter != null) {
          	if (!grantAccess.iRecord.dCentersWithAccess) {
            	// TODO: throw error
              	console.log("Cannot remove because it does not exist");
            } else {
                grantAccess.iRecord.dCentersWithAccess = grantAccess.mRecord.dCentersWithAccess.filter((item) => item !== grantAccess.dCenter);
            }
        }
        let assetRegistry = await getAssetRegistry('orange.medicalblocks.InsuranceRecord');
        await assetRegistry.update(grantAccess.iRecord);
    }
}

/**
* Track the trade of a commodity from one trader to another
* @param {string} mRecordHash - record Hash
* @param {string} userId - user ID to process
* @async
*/
/*async function addMedicalRecord(mRecordHash, userId) {
	console.log("Adding record", mRecordHash, userId);
}*/
