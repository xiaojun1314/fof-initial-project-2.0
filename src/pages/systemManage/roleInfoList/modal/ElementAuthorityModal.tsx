import React, { useState } from 'react';
import { Modal, Button, Checkbox, Divider, Breadcrumb, Space, message } from 'antd';
import { saveRoleAndMoudleElementAndAuthInfo } from '@/pages/systemManage/roleInfoList/service';

export interface ElementAuthorityProps {
  visible: any;
  handleCancelModal: any;
  moduleInfo: any;
  checkAll: any;
  allCheckListId: any;
  setCheckAll: any;
  roleId: any;
  setIndeterminate: any;
  indeterminate: any;
}

const CheckboxGroup = Checkbox.Group;

const ElementAuthorityModal: React.FC<ElementAuthorityProps> = (props) => {

  const [btnDisabled, setBtnDisabled] = useState<boolean>(false);

  const { visible,handleCancelModal,moduleInfo,checkAll,allCheckListId,setCheckAll,roleId,indeterminate,setIndeterminate} = props;

  const [checkTitle, setCheckTitle] = useState({} );

  const handleSubmitModal = async () => {
    setBtnDisabled(true);
    const hide = message.loading('正在授权');
    try {
      const params = {"moduleElementIds":allCheckListId,"role_id": roleId};
      await saveRoleAndMoudleElementAndAuthInfo(params);
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

  const  onCheckChange = (checkedList: any[],index: string | number, ) => {
    const elementIdListTemp= moduleInfo[index].elementIdList;
    elementIdListTemp.map((item: any) => {
      if(allCheckListId.includes(item)){
        const ordernum = allCheckListId.indexOf(item);
        if (ordernum > -1) {
          allCheckListId.splice(ordernum,1);
        }
      }
      return true;
    });
    if(checkedList.length>0){
      checkedList.map(item => allCheckListId.push(item));
    }
    setCheckTitle(()=>{checkTitle[index]=0;return {...checkTitle}})
    checkedList.map((item) => {
      if (elementIdListTemp.includes(item)) {
        // eslint-disable-next-line no-plusplus
        checkTitle[index]++;
        checkAll[index] = checkTitle[index] === elementIdListTemp.length;
        setIndeterminate(()=>{indeterminate[index]=!!checkTitle[index] && (checkTitle[index] < elementIdListTemp.length);return [...indeterminate]});
      }
      return true;
    });
    if (checkTitle[index] === 0) {
      checkAll[index] = false;
      indeterminate[index]=false;
    }
    setIndeterminate(()=>{return [...indeterminate]})
    setCheckTitle(checkTitle);
    setCheckAll(checkAll);
    moduleInfo[index].checkedList=checkedList;
  };


  const  onCheckAllChange = (e: { target: { checked: boolean; }; }, rowIndex: any) => {
    const index = rowIndex;
    checkAll[index] = e.target.checked;
    let checkedListT = [];
    const elementIdListTemp= moduleInfo[index].elementIdList;
    if (checkAll[index] === true) { // 全选
      checkedListT.push(...elementIdListTemp);
      checkedListT = Array.from(new Set(checkedListT)); // 去重（原先indeterminate为true的情况）
      checkTitle[index] = elementIdListTemp.length;
      allCheckListId.push(...Array.from(new Set(elementIdListTemp)));
      const allCheckListIdTemp=Array.from(new Set(allCheckListId));
      allCheckListId.splice(0,allCheckListId.length);
      allCheckListId.push(...allCheckListIdTemp);
    } else {
      checkTitle[index] = 0;
      elementIdListTemp.map((item: any)=>{
        if(allCheckListId.includes(item)){
          const ordernum = allCheckListId.indexOf(item);
          if (ordernum > -1) {
            allCheckListId.splice(ordernum, 1);
          }
        }
        return true;
      });
    }
    setIndeterminate(()=>{indeterminate[index] = false;return [...indeterminate]});
    setCheckTitle(checkTitle);
    moduleInfo[index].checkedList=checkedListT;
  };


  // @ts-ignore
  // @ts-ignore
  // @ts-ignore
  return (
    <Modal
      title="页面元素授权列表"
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
      {moduleInfo!==undefined&&moduleInfo.map((item1: any,index: any)=>
        <div>
          {
            item1.elementList.length!==0&&(
              <Space direction="vertical">
                <Checkbox
                  indeterminate={indeterminate[index]}
                  onChange={(e: any )=>onCheckAllChange(e,index)}
                  checked={checkAll[index]}

                >
                  <Breadcrumb>
                    {item1.levelName.split("-").map((item2: any)=>{return <Breadcrumb.Item>{item2}</Breadcrumb.Item>})}
                  </Breadcrumb>
                </Checkbox>
                <CheckboxGroup options={item1.elementList} value={item1.checkedList} onChange={(checkedList )=>onCheckChange(checkedList,index)}/>
              </Space>
            )
          }
          {moduleInfo.length!==(index+1)&&(<Divider style={{margin:5}}/>)}
        </div>
      )}

    </Modal>
  );
};
export default ElementAuthorityModal;

