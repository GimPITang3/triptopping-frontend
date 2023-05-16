import { useContext, useState } from 'react';

import { UpdatePlanDto, updatePlan } from '@/services/plansService';

import { PlanContext } from '@/contexts';

import NameTab from './NameTab';
import NumberOfMembersTab from './NumberOfMembersTab';
import BudgetTab from './BudgetTab';
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
        <label className="modal-box relative" htmlFor="">
          <div className="space-y-4">
            <div className="tabs tabs-boxed">
              <a
                onClick={() => setTabIndex(0)}
                className={'tab ' + (tabIndex === 0 ? 'tab-active' : '')}
              >
                이름
              </a>
              <a
                onClick={() => setTabIndex(1)}
                className={'tab ' + (tabIndex === 1 ? 'tab-active' : '')}
              >
                인원 수
              </a>
              <a
                onClick={() => setTabIndex(2)}
                className={'tab ' + (tabIndex === 2 ? 'tab-active' : '')}
              >
                예산
              </a>
              <a
                onClick={() => setTabIndex(3)}
                className={'tab ' + (tabIndex === 3 ? 'tab-active' : '')}
              >
                날짜
              </a>
              <a
                onClick={() => setTabIndex(4)}
                className={'tab ' + (tabIndex === 4 ? 'tab-active' : '')}
              >
                태그
              </a>
            </div>
            {GetTab()}
            <div className="flex flex-row justify-end gap-x-2">
              <label className="btn btn-error" htmlFor="modify-name-modal">
                취소
              </label>
              <label
                className="btn btn-success"
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
