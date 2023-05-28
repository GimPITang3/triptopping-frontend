import { useContext, useState } from 'react';

import { UpdatePlanDto, updatePlan } from '@/services/plansService';

import { PlanContext } from '@/contexts';

import BudgetTab from './BudgetTab';
import NameTab from './NameTab';
import NumberOfMembersTab from './NumberOfMembersTab';
import PeriodTab from './PeriodTab';
import TagsTab from './TagsTab';

const ModifyPlanModal: React.FC = () => {
  const { plan, setPlan } = useContext(PlanContext);

  const [tabIndex, setTabIndex] = useState(0);

  const [planName, setPlanName] = useState(plan.name);
  const [planNumberOfMembers, setPlanNumberOfMembers] = useState(
    plan.numberOfMembers,
  );
  const [planBudget, setPlanBudget] = useState(plan.budget);
  const [planPeriod, setPlanPeriod] = useState(plan.period);
  const [planStartDate, setPlanStartDate] = useState(plan.startDate);
  const [planTags, setPlanTags] = useState(plan.tags);

  const GetTab = () => {
    switch (tabIndex) {
      case 0:
        return <NameTab planName={planName} setPlanName={setPlanName} />;
      case 1:
        return (
          <NumberOfMembersTab
            planNumberOfMembers={planNumberOfMembers}
            setPlanNumberOfMembers={setPlanNumberOfMembers}
          />
        );
      case 2:
        return (
          <BudgetTab planBudget={planBudget} setPlanBudget={setPlanBudget} />
        );
      case 3:
        return (
          <PeriodTab
            planPeriod={planPeriod}
            planStartDate={planStartDate}
            setPlanPeriod={setPlanPeriod}
            setPlanStartDate={setPlanStartDate}
          />
        );
      case 4:
        return <TagsTab planTags={planTags} setPlanTags={setPlanTags} />;
      default:
        return <div></div>;
    }
  };

  const onConfirm = async () => {
    const updatePlanDto: UpdatePlanDto = {
      budget: planBudget,
      name: planName,
      numberOfMembers: planNumberOfMembers,
      period: planPeriod,
      startDate: planStartDate,
      tags: planTags,
    };

    const newPlan = await updatePlan(plan.planId, updatePlanDto);

    setPlan(newPlan);
  };

  return (
    <div>
      <input type="checkbox" id="modify-name-modal" className="modal-toggle" />
      <label htmlFor="modify-name-modal" className="modal cursor-pointer">
        <label className="modal-box relative max-w-3xl h-screen" htmlFor="">
          <h2 className="text-2xl font-bold pb-4">
            여행 정보 변경
          </h2>
          <div className="flex flex-col h-[93%]">
            <div>
              <div className="tabs tabs-boxed justify-center bg-slate-100">
                <a
                  onClick={() => setTabIndex(0)}
                  className={'tab tab-lg ' + (tabIndex === 0 ? 'tab-active' : '')}
                >
                  이름
                </a>
                <a
                  onClick={() => setTabIndex(1)}
                  className={'tab tab-lg ' + (tabIndex === 1 ? 'tab-active' : '')}
                >
                  인원
                </a>
                <a
                  onClick={() => setTabIndex(2)}
                  className={'tab tab-lg ' + (tabIndex === 2 ? 'tab-active' : '')}
                >
                  예산
                </a>
                <a
                  onClick={() => setTabIndex(3)}
                  className={'tab tab-lg ' + (tabIndex === 3 ? 'tab-active' : '')}
                >
                  날짜
                </a>
                <a
                  onClick={() => setTabIndex(4)}
                  className={'tab tab-lg ' + (tabIndex === 4 ? 'tab-active' : '')}
                >
                  태그
                </a>
              </div>
            </div>
            <div className="py-4 grow">
              {GetTab()}
            </div>
            <div className="divider"></div>
            <div className="flex justify-end gap-x-4">
              <label className="grow btn btn-outline" htmlFor="modify-name-modal">
                취소
              </label>
              <label
                className="grow btn btn-primary"
                htmlFor="modify-name-modal"
                onClick={onConfirm}
              >
                확인
              </label>
            </div>
          </div>
        </label>
      </label>
    </div>
  );
};

export default ModifyPlanModal;
