+++
author = "Colin Wilson"
categories = [""]
date = "2019-04-25T16:40:01+01:00"
description = "How to reset a forgotten Windows 2012 R2 password on VMware ESXi"
draft = false
publishdate = "2019-05-01T15:17:01+01:00"
tags = ["Windows","Windows 2012","VMware", "ESXi","Password Reset","Password Recovery","Windows Server 2012 R2","Forgotten Password"]
title = "Resetting the Administrator Password on a Windows 2012 R2 VM (VMware ESXi)"

[twitter]
  card = "summary"
  site = "@colinwiIson"
  title = "Resetting the Administrator Password on a Windows 2012 R2 VM (VMware ESXi)"
  description = "How to reset a forgotten Windows 2012 R2 password on VMware ESXi"
  image = "https://colinwilson.uk/img/kemp_lm_opt.png"

+++

<p class="tc"><img src="/img/reset_win_pass/windows-2012-install-gui.jpg"></p>

**TL:DR**: Load any required Storage/RAID controller drivers before attempting to reset Windows password via the installation media in a VMware environment.

I recently found myself in the position of having to reset the Windows (2012 R2) domain admin password in a virtual (VMware) lab environment. This process involves temporarly replacing the `Utilman.exe` executable on the system install drive with a copy of the `cmd.exe` file. However, my domain controller was a VM on ESXi that required a 3rd party SCSi driver be loaded in order to view the OS drive/install.

The easiest method of loading this driver is to copy your drivers to a virtual floppy disk or `.iso` image and mount it on an additional virtual CD/DVD drive then boot the VM from your Windows installation media `.iso` to proceed with the password reset process.

### Instructions

Using the following steps you can reset the admin password on the Windows 2012 R2 domain controller:

1. Boot from the Microsoft Windows Server 2012 DVD

2. From the Windows Setup menu, click “Next”.

3. Select “Repair your computer”

4. Under Choose and option, click on “Troubleshoot”.

5. Under Advanced options, click “Command Prompt”.

6. At the command prompt, run the following command to determine the drive letters in use on the server:

    **`wmic logicaldisk get caption,description,filesystem`**

    ```
    X:\Sources>wmic logicaldisk get caption,description,filesystem
    Caption   Description               Filesystem
    A:        3 1/2 Inch Floppy Drive
    D:        CD-ROM Disc               UDF
    X:        Local Fixed Disk          NTFS
    ```

7. Use the `drvload` command in order to load the paravirtual SCSi driver from the disk/image mounted via your additional drive (in my case A: floppy drive):

    **`drvload A:\AMD64\PVSCSI.INF`**

    ```
    X:\Sources>drvload A:\AMD64\PVSCSI.INF
    DrvLoad: Successfully loaded A:\AMD64\PVSCSI.INF.
    ```
8. Run the `wmic` command again and you should be able to see the local installation disk now (in my case this was **E:**):

    **`wmic logicaldisk get caption,description,filesystem`**

    ```
    X:\Sources>wmic logicaldisk get caption,description,filesystem
    Caption   Description               Filesystem
    A:        3 1/2 Inch Floppy Drive
    C:        Local Fixed Disk          NTFS
    D:        CD-ROM Disc               UDF
    E:        Local Fixed Disk          NTFS
    X:        Local Fixed Disk          NTFS
    ```

    **Note:** Because your server is started with bootable media, the System Reserved partition of your hard drive is temporarily marked as C: and therefore the C: drive that you see from within Windows 2012 is marked as E: drive (since the CD-ROM Disc is marked as D:). This is a temporary modification. Things will revert to normal as soon as you boot Windows 2012 normally.
    The X:\Sources directory is a temporary container that is created when Windows 2012 is booted externally, it allows you to run a host of commands to manage your install.

9. Now switch to your local installation disk (**E:**) and run the commands to replace the `Utilman.exe` file with a copy of `cmd.exe`:

    ```
    X:\Sources>E:
    
    E:\>cd Windows\System32

    E:\Windows\System32>ren Utilman.exe Utilman.bak

    E:\Windows\System32>copy cmd.exe Utilman.exe
            1 file(s) copied
    
    E:\Windows\System32>
    ```

10. Now use the `wpeutil` command to reboot your Windows VM:

    ```
    E:\Windows\System32>wpeutil reboot
    ```

11. Once the VM has rebooted, click the Utility Manager icon to load a command prompt:

    ![Windows 2012 Logon Screen](/img/reset_win_pass/reset-domain-admin-password.png)
    <span class="f7 b">Reset Windows 2012 password (Click Utility Manager Icon)</span><span class="f7 black-40"> | Windows 2012 R2</span>

12. Run the following command to reset your Windows 2012 password (e.g. 'Password123' case sensitive):

    **`net user administrator Password123`**

    ```
    C:\Windows\System32>net user administrator Password123
    The command completed successfully
    
    C:\Windows\System32>
    ```

13. Closing the command prompt, you should now be able to log back onto the server using the password you have provided in the last         step.

### Revert Changes

Once you've confirmed that you can logon to the server you should restore the `Utilman.exe` from the earlier backup.

1. Follow steps 1 to 9 in the **Installation** section above.

2. Run the following commands to restore the `Utilman.exe` from `Utilman.bak`

    ```
    E:\Windows\System32>del Utilman.exe

    E:\Windows\System32>copy Utilman.bak Utilman.exe
            1 file(s) copied
    
    E:\Windows\System32>
    ```    

You can now logout and reboot. Your admin password has now been reset.


*Sources:*
http://www.kieranlane.com/2013/09/18/resetting-administrator-password-windows-2012/

