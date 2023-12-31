import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatSelectionListChange } from '@angular/material/list';
import { BreathingGas } from '../dive-planner-service/BreathingGas';
import { DivePlannerService } from '../dive-planner-service/DivePlannerService';

@Component({
  selector: 'dive-new-dive',
  templateUrl: './new-dive.component.html',
  styleUrls: ['./new-dive.component.scss'],
})
export class NewDiveComponent {
  constructor(
    private router: Router,
    public divePlanner: DivePlannerService
  ) {}

  standardGases: BreathingGas[] = this.divePlanner.getStandardGases();
  selectedStandardGas: BreathingGas = this.standardGases[0];
  gasType = 'standard';
  customGas: BreathingGas = BreathingGas.create(21, 0, 79, this.divePlanner.settings);
  ascentRate = this.divePlanner.settings.ascentRate;
  descentRate = this.divePlanner.settings.descentRate;
  isOxygenNarcotic = this.divePlanner.settings.isOxygenNarcotic;
  workingPO2Maximum = this.divePlanner.settings.workingPO2Maximum;
  decoPO2Maximum = this.divePlanner.settings.decoPO2Maximum;
  pO2Minimum = this.divePlanner.settings.pO2Minimum;
  ENDWarningThreshold = this.divePlanner.settings.ENDWarningThreshold;
  ENDErrorThreshold = this.divePlanner.settings.ENDErrorThreshold;

  isMinDepthError(): boolean {
    return this.getSelectedGas().MinDepth > 0;
  }

  getSelectedGas() {
    if (this.gasType === 'standard') {
      return this.selectedStandardGas;
    } else {
      return this.customGas;
    }
  }

  getCustomGasDisabled() {
    return this.gasType === 'standard';
  }

  getStandardGasDisabled() {
    return this.gasType === 'custom';
  }

  onOxygenInput(): void {
    this.updateCustomGasNitrogen();
  }

  onHeliumInput(): void {
    this.updateCustomGasNitrogen();
  }

  updateCustomGasNitrogen() {
    this.customGas.Nitrogen = 100 - this.customGas.Oxygen - this.customGas.Helium;
    this.customGas = BreathingGas.create(this.customGas.Oxygen, this.customGas.Helium, this.customGas.Nitrogen, this.divePlanner.settings);
  }

  onStandardGasChange(event: MatSelectionListChange) {
    this.selectedStandardGas = event.options[0].value;
  }

  getGasTooltip(gas: BreathingGas): string {
    return `Max Depth (PO2): ${gas.MaxDepthPO2}m (${gas.MaxDepthPO2Deco}m deco)\nMax Depth (END): ${gas.MaxDepthEND}m\nMin Depth (Hypoxia): ${gas.MinDepth}m`;
  }

  onDescentRateInput(): void {
    this.divePlanner.settings.descentRate = this.descentRate;
  }

  onAscentRateInput(): void {
    this.divePlanner.settings.ascentRate = this.ascentRate;
  }

  onOxygenNarcoticChange(): void {
    this.divePlanner.settings.isOxygenNarcotic = this.isOxygenNarcotic;
  }

  onWorkingPO2MaximumInput(): void {
    this.divePlanner.settings.workingPO2Maximum = this.workingPO2Maximum;
  }

  onDecoPO2MaximumInput(): void {
    this.divePlanner.settings.decoPO2Maximum = this.decoPO2Maximum;
  }

  onPO2MinimumInput(): void {
    this.divePlanner.settings.pO2Minimum = this.pO2Minimum;
  }

  onENDWarningThresholdInput(): void {
    this.divePlanner.settings.ENDWarningThreshold = this.ENDWarningThreshold;
  }

  onENDErrorThresholdInput(): void {
    this.divePlanner.settings.ENDErrorThreshold = this.ENDErrorThreshold;
  }

  onSave() {
    this.divePlanner.startDive(this.getSelectedGas());
    this.router.navigate(['/dive-plan']);
  }
}
