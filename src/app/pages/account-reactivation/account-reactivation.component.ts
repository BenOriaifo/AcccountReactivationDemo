import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  FormControl,
} from '@angular/forms';
import {
  MatStepper,
  MatSnackBar,
  MatDialog,
  MatDialogRef,
} from '@angular/material';
import { AccountReactivationService } from 'src/app/core/services/acct-reactivation.service';
import { Router } from '@angular/router';
import { AccountStatus } from 'src/app/core/models/payloads/account-status';
import { UploadedDocument } from 'src/app/core/models/payloads/additional-acct-payload';
import { PickupBranch } from 'src/app/core/models/payloads/atm-pickup-branch';
import { _banksList } from 'src/app/core/models/banks_list';
import { _acctAction } from 'src/app/core/models/payloads/AccountAction';
import { MatSelectChange } from '@angular/material/select';


@Component({
  selector: 'app-account-reactivation',
  templateUrl: './account-reactivation.component.html',
  styleUrls: [
    './account-reactivation.component.css',
    '../../app.component.css',
  ],
})
export class AccountReactivationComponent implements OnInit {
  accountFormGroup: FormGroup;
  otpForm: FormGroup;
  accountDetailsFormGroup: FormGroup;
  corporateAccountDetailsForm: FormGroup;
  personalAccountForm: FormGroup;
  reactivateDormantAccount: FormGroup;
  class = '';
  color = 'primary';
  mode = 'query';
  value = 50;
  bufferValue = 75;
  showSpinner = false;
  disableOTPForm = false;
  additionalServices = ['Internet banking/Mobile App', 'Debit card'];
  identificationOptions = [
    'Nigerian National Identity Card (NIMC Card)',
    "Nigeria Permanent Voter's card (PVC)",
    "Nigeria Driver's Licence",
    'Nigerian International Passport',
  ];
  actionFormBuilder = this.formBuilder.group({
    actions: [null, Validators.required]
  });
  public termsAndConditionModalRef: MatDialogRef<any>;
  public accountActionRef: MatDialogRef<any>;
  public reactivateAccountModalRef: MatDialogRef<any>;
  public savingAccountModalRef: MatDialogRef<any>;
  public corporateAccountModalRef: MatDialogRef<any>;
  public personalAccountModalRef: MatDialogRef<any>;

  @ViewChild('termsAndConditionModalTemplate', { static: true })
  termsAndConditionModalTemplate: TemplateRef<any>;
  @ViewChild('accountActionModal', { static: true })
  accountActionModal: TemplateRef<any>;
  @ViewChild('reactivateAccountModal', { static: true })
  reactivateAccountModal: TemplateRef<any>;
  public informationModalRef: MatDialogRef<any>;
  @ViewChild('informationModalTemplate', { static: true })
  informationModalTemplate: TemplateRef<any>;
  @ViewChild('corporateAccountModal', { static: true })
  corporateAccountModal: TemplateRef<any>;
  @ViewChild('savingAccountModal', { static: true })
  savingAccountModal: TemplateRef<any>;
  @ViewChild('personalAccountModal', { static: true })
  personalAccountModal: TemplateRef<any>;
  isAccountDormant = true;
  isAccountCorporateAndDormant = true;
  idDocExtension: string;
  fileResult: string;
  identificationBase64: string;
  _fileError: string;
  utililtyBill = '';
  _utilityFileError: string;
  utilityFileExt: string;
  utilityBillBase64: string;
  bvnDirectorsFileName: string;
  IntroLetterFileName: string;
  directorsIDFileName: string;
  introLetterError: string;
  signatureFileError: string;
  _selectedFileToUpload: File;
  public supportingDocModel = {
    IntroLetter: '',
    DirectorsID: '',
    SignatoriesID: '',
    meansOfIdentification: '',
    boardResolutionForm: '',
    signatureBase64: '',
  };
  resolutionFile = '';
  resolutionFileError: string;
  signatureFile: any;
  meansOfIdentificationError: string;
  directorsIDFileError: string;
  numError: string;
  isAccountStepperActive = true;
  isAccountStepperDone: boolean;
  accountStatus: string;
  existingAcctScheme: any;
  accountName: any;
  bankBranches: any;
  additionalServiceFormArray: FormArray;
  isIAgreeChecked: boolean;
  acctSegment: any;
  status = AccountStatus;
  otpReference: string;
  ticketID: any;
  bvn: string;
  bvnFileExt: any;
  resolutionFileExt: any;
  introFileExt: any;
  signatoryFileExt: any;
  documents: UploadedDocument[] = [];
  isAwaitingResponse: boolean;
  isSendingFileToUpload: boolean;
  detailFormSpinner: boolean;
  atmPickUpBranchSelected: PickupBranch;
  directorSignatoryFileExt: string;
  option;
  savings;
  ticket;
  isVerifyFormActive = false;
  isVerifyFormDone = false;
  isDetailFormActive = false;
  isDetailFormDone = false;
  email: any;
  data: any;
  bankList = _banksList;
  accountAction = _acctAction;
  maskedBVN: string;
  bvnLength: number;
  selectedValue: string;
  isSavings = false;
  showDownloadRefLetter: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog,
    private acctReactivationService: AccountReactivationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.accountFormGroup = this.formBuilder.group({
      phoneNoCtrl: ['', Validators.required],
      accountNoCtrl: ['', Validators.required],
      
    });
    this.personalAccountForm = this.formBuilder.group({
      selectCtrl: [''],
    });
    this.accountDetailsFormGroup = this.formBuilder.group({
      bvnCtrl: ['', Validators.required],
      houseNo: ['', Validators.required],
      streetCtrl: ['', Validators.required],
      cityCtrl: ['', Validators.required],
      stateCtrl: ['', Validators.required],
      additionalServiceCtrl: new FormArray([]),
      // ['', Validators.required],
      identificationOptCtrl: ['', Validators.required],
      identificationIDCtrl: ['', Validators.required],
      debitCardNameCtrl: ['', Validators.pattern(/^[a-zA-Z\s]*$/)],
      pickUpBranchCtrl: [''],
      fileInputCtrl: ['', Validators.required],
      utililtyBillCtrl: [''],
      signature: ['', Validators.required],
    });
    this.corporateAccountDetailsForm = this.formBuilder.group({
      IntroLetter: ['', [Validators.required]],
      // DirectorsID: ['', [Validators.required]],
      SignatoriesID: ['', [Validators.required]],
      resolutionFileCtrl: [''],
    });
    this.otpForm = this.formBuilder.group({
      otpControl: ['', Validators.required],
    });
    // this.savingAccount();
    this.showTermsAndCondition();
    // this.showAccountActionModal();
    //this.loadBankPickUpBranches();
  }

  get identificationSelected() {
    return this.accountDetailsFormGroup.controls.identificationOptCtrl.value;
  }
  get additionaServiceSelected() {
    return this.accountDetailsFormGroup.controls.additionalServiceCtrl.value;
  }
  get phoneNo() {
    return this.accountFormGroup.controls.phoneNoCtrl.value;
  }
  get acctNo() {
    return this.accountFormGroup.controls.accountNoCtrl.value;
  }
  get houseNo() {
    return this.accountDetailsFormGroup.controls.houseNo.value;
  }
  get street() {
    return this.accountDetailsFormGroup.controls.streetCtrl.value;
  }
  get city() {
    return this.accountDetailsFormGroup.controls.cityCtrl.value;
  }
  get state() {
    return this.accountDetailsFormGroup.controls.stateCtrl.value;
  }
  get atmPickUpBranch() {
    return this.accountDetailsFormGroup.controls.pickUpBranchCtrl.value;
  }
  get preferredName() {
    return this.accountDetailsFormGroup.controls.debitCardNameCtrl.value;
  }
  
  get actions() {
    return this.actionFormBuilder.get('actions');
  }
  maskEmailAddress(emailAddress: string) {
    if (emailAddress) {
      let maskid = '';
      const prefix = emailAddress.substring(0, emailAddress.lastIndexOf('@'));
      const postfix = emailAddress.substring(emailAddress.lastIndexOf('@'));

      for (let i = 0; i < prefix.length; i++) {
        if (i === 0 || i === prefix.length - 1) {
          ////////
          maskid = maskid + prefix[i].toString();
        } else {
          maskid = maskid + '*';
        }
      }
      maskid = maskid + postfix;

      console.log(maskid);
      return maskid;
    } else {
      return emailAddress;
    }
  }

  maskBVN(bvn: string) {
    if (bvn) {
      /** Condition will only executes if accountId is *not* undefined, null, empty, false or 0*/
      const accountIdlength = bvn.length;
      const maskedLength =
        accountIdlength - 4; /** Modify the length as per your wish */
      let newString = bvn;
      for (let i = 0; i < accountIdlength; i++) {
        if (i < maskedLength) {
          newString = newString.replace(bvn[i], '*');
        }
      }
      return newString;
    } else return; /**Will handle if no string is passed */
  }
  validateStepper(): boolean {
    if (this.accountDetailsFormGroup.invalid) {
      return true;
    }
    // if (this.additionaServiceSelected.length === 0) {
    //   return true;
    // }
    if (
      this.additionaServiceSelected.length > 0 &&
      this.additionaServiceSelected.includes('Debit card') &&
      !this.atmPickUpBranch &&
      !this.preferredName
    ) {
      return true;
    }

    return false;
  }
  savingsAccount() {
    this.isSavings = true;
  }

  //change from Sam
  changeRatio(event: MatSelectChange) {
    console.log('Value of selected '+event.value);
    }
  onSelect(opt) {
    console.log(opt);
    this.atmPickUpBranchSelected = opt;
    console.log(this.atmPickUpBranch);
  }
  onChange(service, evt) {
    console.log(service, evt);
    this.additionalServiceFormArray = this.accountDetailsFormGroup.controls
      .additionalServiceCtrl as FormArray;
    if (evt.checked === true) {
      this.additionalServiceFormArray.push(new FormControl(service));
    } else {
      const index = this.additionalServiceFormArray.controls.findIndex(
        (x) => x.value === service
      );
      this.additionalServiceFormArray.removeAt(index);
    }
  }
  onSelectIdentification(identification) {}

  showTermsAndCondition() {
    this.termsAndConditionModalRef = this.dialog.open(
      this.termsAndConditionModalTemplate,
      {
        width: '1200px',
        height: '600px',
        disableClose: true,
      }
    );

    this.termsAndConditionModalRef.afterClosed().subscribe((result) => {
      console.log(result);
      this.isIAgreeChecked = false;
    });
  }
  closeTermsAndOpenAction() {
    this.dialog.closeAll();
    this.showAccountActionModal();
  }
  proceedToAccountValidation(stepper: MatStepper) {
    // this.isRequirementActive = false;
    // this.isRequirementDone = true;
    this.isAccountStepperActive = true;
    this.isAccountStepperDone = false;
    stepper.next();
  }
  showAccountActionModal() {
    this.accountActionRef = this.dialog.open(this.accountActionModal, {
      width: '686px',
      height: '320px',
      disableClose: true,
    });
    this.accountActionRef.afterClosed().subscribe((result) => {
      console.log(result);
    });
  }
  moveToCorporateAccount(stepper) {
    this.proceedToAccountValidation(stepper);
    this.isDetailFormActive = true;
    // this.closeDialogModal();
    // this.corporateAccount();
  }
  moveToSavingsAccount() {
    this.closeDialogModal();
    this.savingAccount();
  }
  moveToStepper(stepper) {
    this.closeDialogModal();
    this.proceedToAccountValidation(stepper);
  }
  personalAccount(stepper) {
    // this.personalAccountModalRef = this.dialog.open(this.personalAccountModal, {
    //   width: '400px',
    //   height: '200px',
    //   disableClose: true,
    // });
  }
  reactivateAccount(stepper) {
    this.proceedToAccountValidation(stepper);
    this.reactivateAccountModalRef = this.dialog.open(
      this.reactivateAccountModal,
      {
        width: '400px',
        height: '200px',
        disableClose: true,
      }
    );
    this.reactivateAccountModalRef.afterClosed().subscribe((result) => {
      console.log(result);
    });
  }
  savingAccount() {
    this.savingAccountModalRef = this.dialog.open(this.savingAccountModal, {
      width: '800px',
      height: '600px',
      disableClose: true,
    });
    this.savingAccountModalRef
      .afterClosed()
      .subscribe((result) => console.log(result));
  }
  corporateAccount() {
    this.corporateAccountModalRef = this.dialog.open(
      this.corporateAccountModal,
      { width: '600px', height: '520px', disableClose: true }
    );
  }

  goHome() {
    this.router.navigate(['/home']);
    this.dialog.closeAll();
  }

  closeDialogModal() {
    this.dialog.closeAll();
  }

  loadBankPickUpBranches() {
    this.acctReactivationService.loadBankPickUpBranches().subscribe(
      (resp) => {
        this.showSpinner = false;
        if (resp.ResponseCode === '00') {
          this.bankBranches = resp.Data;
        } else {
          this._snackBar.open(resp.ResponseDescription, 'ok', {
            verticalPosition: 'top',
            horizontalPosition: 'center',
            duration: 5000,
            panelClass: ['errorSnackbar'],
          });
        }
      },
      (err) => {
        this.showSpinner = false;
        this._snackBar.open('Error occured', ' Error', {
          verticalPosition: 'top',
          horizontalPosition: 'center',
          duration: 5000,
          panelClass: ['errorSnackbar'],
        });
      }
    );
  }

  validateAccountDetails(stepper: MatStepper) {
    this.validateDigits(this.phoneNo, this.acctNo);
    const payload = {
      accountNumber: this.acctNo.toString(),
      phoneNumber: this.phoneNo,
    };
    this.showSpinner = true;
    this.isAwaitingResponse = true;
    this.acctReactivationService.validateAccountNoAndPhoneNo(payload).subscribe(
      (resp) => {
        this.showSpinner = false;
        this.isAwaitingResponse = false;
        if (resp.ResponseCode === '00') {
          this.isAccountStepperDone = true;
          // this.isTierFormActive = true;
          this.isAccountStepperActive = false;
          this.accountStatus = resp.Data.AccountStatus;
          this.existingAcctScheme = resp.Data.AccountScheme;
          this.acctSegment = resp.Data.AccountSegment;
          this.bvn = resp.Data.BVN;
          this.bvnLength = this.bvn.length;
          const bvn = this.maskBVN(resp.Data.BVN);
          this.maskedBVN = bvn;
          const emailToMask = resp.Data.Email;
          // const emailToMask = 'menaesezobor@gmail.com';
          this.email = this.maskEmailAddress(emailToMask);
          if (this.bvnLength > 10) {
            this.accountDetailsFormGroup.patchValue({ bvnCtrl: this.bvn });
          }
          if (this.bvnLength < 10) {
            this.accountDetailsFormGroup.patchValue({ bvnCtrl: 'Enter BVN' });
          }
          this.accountName = resp.Data.FirstName + ' ' + resp.Data.Lastname;
          if (this.accountStatus === AccountStatus.Dormant) {
            this._snackBar.open(
              `Account for ${this.accountName} has been Validated successfully`,
              'Ok',
              {
                verticalPosition: 'top',
                horizontalPosition: 'center',
                duration: 5000,
                panelClass: ['errorSnackbar'],
              }
            );
            this.isDetailFormActive = true;
            stepper.next();
          } else {
            // remove comment
            this.showInformationModal();
          }
        } else {
          this._snackBar.open(resp.ResponseDescription, 'Ok', {
            verticalPosition: 'top',
            horizontalPosition: 'center',
            duration: 5000,
            panelClass: ['errorSnackbar'],
          });
        }
      },
      (err) => {
        this.showSpinner = false;
        this.isAwaitingResponse = false;
        this._snackBar.open('Error occured', ' Error', {
          verticalPosition: 'top',
          horizontalPosition: 'center',
          duration: 5000,
          panelClass: ['errorSnackbar'],
        });
      }
    );
  }
  showInformationModal() {
    this.informationModalRef = this.dialog.open(this.informationModalTemplate, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
    });

    this.informationModalRef.afterClosed().subscribe((result) => {
      console.log(result);
      this.isIAgreeChecked = false;
    });
  }
  disagreeTC() {
    this.dialog.closeAll();
  }
  validateDigits(phoneNo, accountNo) {
    const isNum = /^\d+$/.test(phoneNo) && /^\d+$/.test(accountNo);
    if (!isNum) {
      this.numError = 'This field takes only digits!';
      this._snackBar.open(this.numError, 'Failed', {
        verticalPosition: 'top',
        horizontalPosition: 'center',
        duration: 5000,
        panelClass: ['errorSnackbar'],
      });
      return;
    }
  }

  resendOTP() {
    const payload = {
      accountNumber: this.acctNo.toString(),
    };
    this.showSpinner = true;
    this.acctReactivationService.sendOTPToCustomer(payload).subscribe(
      (response) => {
        this.showSpinner = false;
        if (response.ResponseCode === '00') {
          this.otpReference = response.Data;
          this._snackBar.open(
            'Please provide the otp sent to your registered phone number',
            'Ok',
            {
              verticalPosition: 'top',
              horizontalPosition: 'center',
              duration: 5000,
              panelClass: ['errorSnackbar'],
            }
          );
        } else {
          this._snackBar.open('OTP Initiation failed', 'Failed', {
            verticalPosition: 'top',
            horizontalPosition: 'center',
            duration: 5000,
            panelClass: ['errorSnackbar'],
          });
        }
      },
      (err) => {
        this.showSpinner = false;
        this._snackBar.open('Error occured', 'Error', {
          verticalPosition: 'top',
          horizontalPosition: 'center',
          duration: 5000,
          panelClass: ['errorSnackbar'],
        });
      }
    );
  }
  validateOTP(stepper: MatStepper) {
    this.isVerifyFormActive = true;
    this.proceedToAccountValidation(stepper);
    // const payload = {
    //   otp: this.otpForm.controls.otpControl.value,
    //   otpRefence: this.otpReference,
    //   accountNumber: this.acctNo,
    // };
    // this.showSpinner = true;
    // this.disableOTPForm = true;
    // this.acctReactivationService.validateOTP(payload).subscribe(
    //   (response) => {
    //     // response.ResponseCode ==='00';
    //     if (response.ResponseCode === '00') {
    //       this._snackBar.open('OTP Validated Successfully', 'OK', {
    //         verticalPosition: 'top',
    //         horizontalPosition: 'center',
    //         duration: 5000,
    //         panelClass: ['errorSnackbar'],
    //       });

    //       this.InitiateRequest(stepper);
    //     } else {
    //       //this.showSpinner = false;
    //       this._snackBar.open('OTP Validated failed', 'Failed', {
    //         verticalPosition: 'top',
    //         horizontalPosition: 'center',
    //         duration: 5000,
    //         panelClass: ['errorSnackbar'],
    //       });
    //       this.disableOTPForm = false;
    //       // this.InitiateRequest(stepper);
    //     }
    //   },
    //   (err) => {
    //     this.showSpinner = false;
    //     this._snackBar.open('Error occured', 'Error', {
    //       verticalPosition: 'top',
    //       horizontalPosition: 'center',
    //       duration: 5000,
    //       panelClass: ['errorSnackbar'],
    //     });
    //   }
    // );
  }
  buildRequestPayload() {
    const payload = {
      accountNumber: this.acctNo,
      accountName: this.accountName,
      phoneNumber: this.phoneNo,
      accountType: this.acctSegment, // need to confirm
      accountStatus:
        this.accountStatus === AccountStatus.Dormant ? 'Dormant' : 'Dormant',
      additionalServices: this.additionaServiceSelected,
      bvn: this.bvn,
      preferredNameOnCard: this.preferredName ? this.preferredName : 'N/A',
      address:
        this.acctSegment === 'PB-PERSONAL BANKING'
          ? `${this.houseNo},${this.street},${this.city},${this.state}.`.trim()
          : '',
      atmPickUpBranchName: this.atmPickUpBranchSelected
        ? this.atmPickUpBranchSelected.Branch_Name
        : 'N/A',
      atmPickUpBranchState: this.atmPickUpBranchSelected
        ? this.atmPickUpBranchSelected.Branch_Name
        : 'N/A',
      atmPickUpBranchId: this.atmPickUpBranchSelected
        ? this.atmPickUpBranchSelected.SOL_ID
        : 'N/A',
      documents: this.documents,
    };
    return payload;
  }

  InitiateRequest(stepper?: MatStepper) {
    const reqPayload = this.buildRequestPayload();
    this.showSpinner = true;
    this.isAwaitingResponse = true;
    this.acctReactivationService.initiateRequest(reqPayload).subscribe(
      (response) => {
        this.showSpinner = false;
        if (response.ResponseCode === '00') {
          this.disableOTPForm = false;
          this.isVerifyFormActive = false;
          this.isVerifyFormDone = true;
          this.isAwaitingResponse = false;
          this.ticketID = response.Data.TicketID;
          this._snackBar.open(response.ResponseDescription, 'Ok', {
            verticalPosition: 'top',
            horizontalPosition: 'center',
            duration: 5000,
            panelClass: ['successSnackbar'],
          });

          stepper.next();
        } else {
          this.showSpinner = false;
          this._snackBar.open(response.ResponseDescription, 'Failed', {
            verticalPosition: 'top',
            horizontalPosition: 'center',
            duration: 5000,
            panelClass: ['successSnackbar'],
          });
          this.disableOTPForm = false;
        }
      },
      (err) => {
        this.showSpinner = false;
        this.disableOTPForm = false;
        this._snackBar.open(err.message, 'Error', {
          verticalPosition: 'top',
          horizontalPosition: 'center',
          duration: 5000,
          panelClass: ['errorSnackbar'],
        });
      }
    );
  }
  removeSelectedFile(fileName) {
    if (fileName === 'Identification') {
      this.fileResult = '';
      this.accountDetailsFormGroup.setValue({ fileInputCtrl: '' });
    }
    if (fileName === 'Board Resolution') {
      this.resolutionFile = '';
      this.corporateAccountDetailsForm.controls.resolutionFileCtrl.setValue('');
    }
    if (fileName === 'Utility Bill') {
      this.utililtyBill = '';
      this.accountDetailsFormGroup.patchValue({ utililtyBillCtrl: '' });
    }
    if (fileName === 'Signature') {
      this.signatureFile = '';
      this.accountDetailsFormGroup.setValue({ signature: '' });
    }
    if (fileName === 'IntroLetter') {
      this.IntroLetterFileName = '';
      this.corporateAccountDetailsForm.controls.IntroLetter.setValue('');
    }
    if (fileName === 'SignatoriesID') {
      this.directorsIDFileName = '';
      this.corporateAccountDetailsForm.controls.SignatoriesID.setValue('');
    }
  }
  onFileSelected(event, fileName) {
    const _fileToUpload: File = event.target.files[0];

    if (_fileToUpload.size / (1000 * 1024) > 2) {
      this.fileResult = fileName === 'Identification' ? '' : this.fileResult;
      this.resolutionFile =
        fileName === 'Board Resolution' ? '' : this.resolutionFile;
      this.utililtyBill = fileName === 'Utility Bill' ? '' : this.utililtyBill;
      this.signatureFile = fileName === 'Signature' ? '' : this.signatureFile;
      this.IntroLetterFileName =
        fileName === 'IntroLetter' ? '' : this.IntroLetterFileName;
      this.directorsIDFileName =
        fileName === 'SignatoriesID' ? '' : this.directorsIDFileName;

      this._fileError =
        fileName === 'Identification'
          ? 'Size limit for the identification file is 2 MB'
          : '';
      this._utilityFileError =
        fileName === 'Utility Bill'
          ? 'Size limit for the utility bill file is 2 MB'
          : '';
      this.signatureFileError =
        fileName === 'Signature'
          ? 'Size limit for the signature file is 2 MB'
          : '';
      this.introLetterError =
        fileName === 'IntroLetter'
          ? 'Size limit for the instruction letter file is 2 MB'
          : '';
      this.directorsIDFileError =
        fileName === 'SignatoriesID'
          ? 'Size limit for the signatories ID file is 2 MB'
          : '';
      this.resolutionFileError =
        fileName === 'Board Resolution'
          ? 'Size limit for the board resolution file is 2 MB'
          : '';

      this._snackBar.open('Size limit for the file is 2 MB', 'Ok', {
        verticalPosition: 'top',
        horizontalPosition: 'center',
        duration: 5000,
        panelClass: 'errorClass',
      });
      event.target.value = '';
      return;
    }

    if (!event.target.files || event.target.files.length < 1) {
      this.fileResult = fileName === 'Identification' ? '' : this.fileResult;
      this.utililtyBill = fileName === 'Utility Bill' ? '' : this.utililtyBill;
      this.signatureFileError =
        fileName === 'Signature' ? '' : this.signatureFile;

      this.bvnDirectorsFileName =
        fileName === 'DirectorsID' ? '' : this.bvnDirectorsFileName;
      this.IntroLetterFileName =
        fileName === 'IntroLetter' ? '' : this.IntroLetterFileName;
      this.directorsIDFileName =
        fileName === 'SignatoriesID' ? '' : this.directorsIDFileName;
      this.resolutionFile =
        fileName === 'Board Resolution' ? '' : this.resolutionFile;

      this._fileError =
        fileName === 'Identification'
          ? 'No file selected. Please select a valid pdf/jpeg file to upload'
          : '';
      this._utilityFileError =
        fileName === 'Utility Bill'
          ? 'No file selected. Please select a valid pdf/jpeg file to upload'
          : '';
      this.introLetterError =
        fileName === 'IntroLetter'
          ? 'No file selected. Please select a valid pdf/jpeg file to upload'
          : '';
      this.directorsIDFileError =
        fileName === 'SignatoriesID'
          ? 'No file selected. Please select a valid pdf/jpeg file to upload'
          : '';
      this.resolutionFileError =
        fileName === 'Board Resolution'
          ? 'Size limit for the file is 2 MB'
          : '';

      this._snackBar.open(
        'No file selected. Please select a valid pdf/jpeg file to upload',
        'Ok',
        {
          verticalPosition: 'top',
          horizontalPosition: 'center',
          duration: 5000,
        }
      );
      event.target.value = '';
      return;
    }
    const element = event.target as HTMLInputElement;

    this._selectedFileToUpload = _fileToUpload;
    let fileTypeError = this.validateFileType(this._selectedFileToUpload);
    if (fileTypeError) {
      this._fileError = fileTypeError;
      this._snackBar.open(fileTypeError, 'Failed', {
        verticalPosition: 'top',
        horizontalPosition: 'center',
        duration: 5000,
      });
      element.value = '';
      return;
    }
    const file: File = event.target.files[0];
    if (fileName === 'Identification') {
      this._fileError = '';
      this.fileResult = event.target.files[0].name;
      const extension = this.fileResult.split('.');
      this.idDocExtension = extension[extension.length - 1];
      this.accountDetailsFormGroup.patchValue({
        fileInputCtrl: this.fileResult,
      });
      this._snackBar.open('File uploaded successfully', 'Ok', {
        verticalPosition: 'top',
        horizontalPosition: 'center',
        duration: 5000,
      });

      this.ConvertToBase64(file).then((result) => {
        this.identificationBase64 = this.transformBase64String(result);
      });
    }
    if (fileName === 'Utility Bill') {
      this._utilityFileError = '';
      const extension = event.target.files[0].name.split('.');
      this.utilityFileExt = extension[extension.length - 1];
      this.utililtyBill = event.target.files[0].name;
      this.accountDetailsFormGroup.patchValue({
        utililtyBillCtrl: event.target.files[0].name,
      });
      this._snackBar.open('File uploaded successfully', 'Ok', {
        verticalPosition: 'top',
        horizontalPosition: 'center',
        duration: 5000,
      });
      this.ConvertToBase64(file).then((result) => {
        this.utilityBillBase64 = this.transformBase64String(result);
      });
    }

    if (fileName === 'Signature') {
      this.signatureFileError = '';
      const extension = event.target.files[0].name.split('.');
      this.signatoryFileExt = extension[extension.length - 1];
      this.signatureFile = event.target.files[0].name;
      this.accountDetailsFormGroup.patchValue({
        signature: event.target.files[0].name,
      });
    }
    if (fileName === 'DirectorsID') {
      this._fileError = '';
      const extension = event.target.files[0].name.split('.');
      this.bvnFileExt = extension[extension.length - 1];
      this.bvnFileExt = event.target.files[0].name;
      this.bvnDirectorsFileName = event.target.value.substring(12);
      this.corporateAccountDetailsForm.controls.DirectorsID.setValue(
        this.bvnDirectorsFileName
      );
      this._snackBar.open(
        'Directors BVN has been uploaded successfully',
        'OK',
        {
          verticalPosition: 'top',
          horizontalPosition: 'center',
          duration: 5000,
        }
      );
    }

    if (fileName === 'Board Resolution') {
      this.resolutionFileError = '';
      const extension = event.target.files[0].name.split('.');
      this.resolutionFileExt = extension[extension.length - 1];
      this.resolutionFile = event.target.value.substring(12);
      this.corporateAccountDetailsForm.controls.resolutionFileCtrl.setValue(
        this.resolutionFile
      );
      this._snackBar.open(
        'Resolution file has been uploaded successfully',
        'OK',
        {
          verticalPosition: 'top',
          horizontalPosition: 'center',
          duration: 5000,
        }
      );
    }

    if (fileName === 'IntroLetter') {
      this.introLetterError = '';
      const extension = event.target.files[0].name.split('.');
      this.introFileExt = extension[extension.length - 1];
      this.IntroLetterFileName = event.target.value.substring(12);
      this.corporateAccountDetailsForm.controls.IntroLetter.setValue(
        this.IntroLetterFileName
      );
      this._snackBar.open(
        'Instruction Letter has been uploaded successfully',
        'OK',
        {
          verticalPosition: 'top',
          horizontalPosition: 'center',
          duration: 5000,
        }
      );
    }
    if (fileName === 'SignatoriesID') {
      this.signatureFileError = '';
      const extension = event.target.files[0].name.split('.');
      this.directorSignatoryFileExt = extension[extension.length - 1];
      this.directorsIDFileName = event.target.value.substring(12);
      this.corporateAccountDetailsForm.controls.SignatoriesID.setValue(
        this.directorsIDFileName
      );
      this._snackBar.open(
        'Signatories ID has been uploaded successfully',
        'OK',
        {
          verticalPosition: 'top',
          horizontalPosition: 'center',
          duration: 5000,
        }
      );
    }
    fileTypeError = '';
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(this._selectedFileToUpload);
    fileReader.onload = (e: any) => {
      if (fileName === 'DirectorsID') {
        this.ConvertDirectorsID();
        return;
      }
      if (fileName === 'SignatoriesID') {
        this.ConvertSignatoriesID();
        return;
      }
      if (fileName === 'IntroLetter') {
        this.ConvertIntroLetter();
        return;
      }

      if (fileName === 'Identification') {
        this.ConvertIdentificationCard();
        return;
      }

      if (fileName === 'Board Resolution') {
        this.convertBoardResolutionForm();
        return;
      }
      if (fileName === 'Signature') {
        this.ConvertSignature();
        return;
      }
    };
    event.target.value = '';
  }

  convertBoardResolutionForm() {
    try {
      this.ConvertToBase64(this._selectedFileToUpload).then((result) => {
        this.supportingDocModel.boardResolutionForm = this.transformBase64String(
          result
        );
      });
    } catch (error) {
      console.log(error);
      this._snackBar.open('Error occured', 'Error', { duration: 5000 });
      return;
    }
  }

  ConvertDirectorsID() {
    try {
      this.ConvertToBase64(this._selectedFileToUpload).then((result) => {
        this.supportingDocModel.DirectorsID = this.transformBase64String(
          result
        );
      });
    } catch (error) {
      console.log(error);
      this._snackBar.open('Error occured', 'Error', { duration: 5000 });
      return;
    }
  }

  ConvertSignature() {
    try {
      this.ConvertToBase64(this._selectedFileToUpload).then((result) => {
        this.supportingDocModel.signatureBase64 = this.transformBase64String(
          result
        );
      });
    } catch (error) {
      console.log(error);
      this._snackBar.open('Error occured', 'Error', { duration: 5000 });
      return;
    }
  }
  ConvertIdentificationCard() {
    try {
      this.ConvertToBase64(this._selectedFileToUpload).then((result) => {
        this.supportingDocModel.meansOfIdentification = this.transformBase64String(
          result
        );
      });
    } catch (error) {
      console.log(error);
      this._snackBar.open('Error occured', 'Error', { duration: 5000 });
      return;
    }
  }

  ConvertSignatoriesID() {
    try {
      this.ConvertToBase64(this._selectedFileToUpload).then((result) => {
        this.supportingDocModel.SignatoriesID = this.transformBase64String(
          result
        );
      });
    } catch (error) {
      console.log(error);
      this._snackBar.open('Error occured', 'Error', { duration: 5000 });
      return;
    }
  }

  ConvertIntroLetter() {
    try {
      this.ConvertToBase64(this._selectedFileToUpload).then((result) => {
        this.supportingDocModel.IntroLetter = this.transformBase64String(
          result
        );
      });
    } catch (error) {
      console.log(error);
      this._snackBar.open('Error occured', 'Error', { duration: 5000 });
      return;
    }
  }
  ConvertToBase64(file: File): Promise<any> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  validateFileType(File): string {
    const fileExtension = this._selectedFileToUpload.name
      .toString()
      .toLowerCase()
      .substr(this._selectedFileToUpload.name.lastIndexOf('.'));
    switch (fileExtension) {
      case '.pdf':
      case '.jpeg':
      case '.jpg':
      case '.png':
        return '';
      default:
        return `${this._selectedFileToUpload.name} is a not a valid type. Valid files must either be pdf or jpeg files`;
    }
  }
  transformBase64String(base64String: string) {
    if (base64String && base64String.indexOf('base64') > -1) {
      const hay = base64String.indexOf('base64');
      return base64String.substr(hay + 7);
    }
    console.log(base64String);
    return base64String;
  }

  initiateOTP(stepper: MatStepper) {
    const payload = {
      accountNumber: this.acctNo.toString(),
    };
    this.detailFormSpinner = true;
    this.isSendingFileToUpload = true;
    this.acctReactivationService.sendOTPToCustomer(payload).subscribe(
      (response) => {
        this.detailFormSpinner = false;
        this.isSendingFileToUpload = false;
        if (response.ResponseCode === '00') {
          this.otpReference = response.Data;
          this._snackBar.open(
            'Please provide the otp sent to your registered phone number',
            'Ok',
            {
              verticalPosition: 'top',
              horizontalPosition: 'center',
              duration: 5000,
              panelClass: ['errorSnackbar'],
            }
          );
          this.isDetailFormActive = false;
          stepper.next();
          this.isDetailFormDone = true;
          this.isVerifyFormActive = true;
        } else {
          this._snackBar.open('OTP Initiation failed', 'Failed', {
            verticalPosition: 'top',
            horizontalPosition: 'center',
            duration: 5000,
            panelClass: ['errorSnackbar'],
          });
          this.isSendingFileToUpload = false;
        }
      },
      (err) => {
        this.detailFormSpinner = false;
        this.isSendingFileToUpload = false;
        this._snackBar.open('Error occured', 'Error', {
          verticalPosition: 'top',
          horizontalPosition: 'center',
          duration: 5000,
          panelClass: ['errorSnackbar'],
        });
      }
    );
  }

  confirmCorporateRequest(stepper: MatStepper) {
    this.initiateOTP(stepper);
    this.onSubmitDocumentsFormGroup(stepper);
  }
  async confirmRequest(stepper) {
    try {
      await this.validateBVN(stepper);
    } catch (error) {
      console.log(error);
    }
  }
  validateBVN(stepper) {
    const payload = {
      bvn: this.bvn.toString(),
      accountNumber: this.acctNo,
    };
    this.detailFormSpinner = true;
    this.isSendingFileToUpload = true;
    this.acctReactivationService.validateBVN(payload).subscribe(
      (response) => {
        this.detailFormSpinner = false;
        this.isSendingFileToUpload = false;
        if (response.ResponseCode === '00') {
          this._snackBar.open('BVN Validation successful', 'Ok', {
            verticalPosition: 'top',
            horizontalPosition: 'center',
            duration: 5000,
            panelClass: ['errorSnackbar'],
          });
          this.isDetailFormActive = false;

          this.initiateOTP(stepper);
          this.buildPersonalAcctRequestDocs();
        } else {
          this._snackBar.open(response.ResponseDescription, 'Failed', {
            verticalPosition: 'top',
            horizontalPosition: 'center',
            duration: 5000,
            panelClass: ['errorSnackbar'],
          });
          this.isSendingFileToUpload = false;
          return;
        }
      },
      (err) => {
        this.detailFormSpinner = false;
        this.isSendingFileToUpload = false;
        this._snackBar.open('Error occured', 'Error', {
          verticalPosition: 'top',
          horizontalPosition: 'center',
          duration: 5000,
          panelClass: ['errorSnackbar'],
        });
      }
    );
  }
  buildPersonalAcctRequestDocs() {
    const documents: UploadedDocument = {
      title: 'Signature',
      name: this.signatureFile,
      base64Content: this.supportingDocModel.signatureBase64,
      documentExt: this.signatoryFileExt,
    };
    this.documents.push(documents);
    if (this.utililtyBill) {
      const utilityDoc: UploadedDocument = {
        title: 'Utility Bill',
        name: this.utililtyBill,
        base64Content: this.utilityBillBase64,
        documentExt: this.utilityFileExt,
      };
      this.documents.push(utilityDoc);
    }
    const identificationDoc: UploadedDocument = {
      title: 'Means of Identification',
      name: this.fileResult,
      base64Content: this.supportingDocModel.meansOfIdentification,
      documentExt: this.idDocExtension,
    };
    this.documents.push(identificationDoc);
  }
  onSubmitDocumentsFormGroup(stepper: MatStepper) {
    this.isAwaitingResponse = true;
    // this.isAuthenticationFormActive = true;
    const documents: UploadedDocument = {
      title: 'SignatoriesID',
      name: this.directorsIDFileName,
      base64Content: this.supportingDocModel.SignatoriesID,
      documentExt: this.directorSignatoryFileExt,
    };
    this.documents.push(documents);

    const intstructionLetterDocuments: UploadedDocument = {
      title: 'Instruction Letter',
      name: this.IntroLetterFileName,
      base64Content: this.supportingDocModel.IntroLetter,
      documentExt: this.introFileExt,
    };
    this.documents.push(intstructionLetterDocuments);

    if (this.resolutionFile) {
      const boardResolutionDocument: UploadedDocument = {
        title: 'Board Resolution',
        name: this.resolutionFile,
        base64Content: this.supportingDocModel.boardResolutionForm,
        documentExt: this.resolutionFileExt,
      };
      this.documents.push(boardResolutionDocument);
    }
    console.log(this.documents, 'documents');
  }

  openDialog(){
    console.log(this.termsAndConditionModalTemplate);
  }

  onActionChange(value) {
    console.log('Writer changed...');
    console.log(value);
    if(value === 'Continue operating a current account') {
      this.showDownloadRefLetter = true;
    }
    else {
      this.showDownloadRefLetter = false;
    }

    //this.filteredBooks = this.bookService.getBooksByWriter(this.writer.value.wid);
  }
}
