import React from 'react';
import { Tree } from 'antd';

const { DirectoryTree } = Tree;

export interface OrgTreeProps {
  treeData: any,
  handleOnSelectTree: (selectedKeys: React.Key[],info: any) => void;
  loopIconItem: any
}

 const OrgTreeList: React.FC<OrgTreeProps> = (props) => {

  const { treeData,loopIconItem,handleOnSelectTree } = props;
  return (
    <div>
      {treeData!==undefined&&treeData.length>0&&(
        <DirectoryTree
          defaultExpandAll
          autoExpandParent={true}
          onSelect={(selectedKeys: React.Key[],info: any) => handleOnSelectTree(selectedKeys,info)}
          treeData={loopIconItem(treeData)}
        >
        </DirectoryTree>
      )}
    </div>
  );
};
 export default OrgTreeList;

