import React, { useState } from 'react';
import { Modal, Button, message,Tree } from 'antd';
import {loopIconItem}  from '@/utils/common';
import { saveRoleAndMenuAndAuthInfo} from '../service';

const { DirectoryTree } = Tree;


export interface MenuAuthorityProps {
  visible: any;
  handleCancelModal: any;
  treeData: any;
  checkedKeys: any;
  setCheckedKeys: any;
  roleId: any;

}


const MenuAuthorityModal: React.FC<MenuAuthorityProps> = (props) => {
  const [btnDisabled, setBtnDisabled] = useState<boolean>(false);
  const { visible,handleCancelModal,treeData,checkedKeys,setCheckedKeys,roleId } = props;

  const handleSubmitModal = async () => {
    setBtnDisabled(true);
    const hide = message.loading('正在授权');
    try {
      const params = {"menuIds":checkedKeys,"role_id": roleId};
      await saveRoleAndMenuAndAuthInfo(params);
      hide();
      message.success('操作成功');
      return true;
    } catch (error) {
      hide();
      message.error('操作失败');
      return false;
    }finally{
      handleCancelModal();
      setBtnDisabled(false);
    }
  }


  const onCheckTree= (selectedKeys: any) =>{
    setCheckedKeys(selectedKeys);
  };


  return (
    <Modal
      title="角色分配菜单列表"
      style={{ top: 100 }}
      visible={visible}
      width={1500}
      onCancel={handleCancelModal}
      destroyOnClose={true}
      maskClosable={false}
      footer={[
        <Button key="back" onClick={() => handleCancelModal()} disabled={btnDisabled}>取消</Button>,
        <Button key="submit" type="primary" disabled={btnDisabled} onClick={() => handleSubmitModal()}>提交</Button>,
      ]}
    >
      {treeData!==undefined&&treeData.length>0&&(
        <DirectoryTree
          checkable
          defaultExpandAll
          autoExpandParent={true}
          // onSelect={(selectedKeys: React.Key[],info: any) => props.handleOnSelectMenuTree(selectedKeys,info)}
          treeData={loopIconItem(treeData)}
          checkedKeys={checkedKeys}
          onCheck={onCheckTree}
        >
        </DirectoryTree>
      )
      }
    </Modal>
  );
};
export default MenuAuthorityModal;

