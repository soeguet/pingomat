//go:build windows
// +build windows

package main

import (
	"os/exec"
	"syscall"
	"unsafe"
)

func configureCmd(cmd *exec.Cmd) {
	cmd.SysProcAttr = &syscall.SysProcAttr{HideWindow: true}
}

func SendPing(internalIP string) *exec.Cmd {
	cmd := exec.Command("ping", "-n", "1", "-w", "250", internalIP)
	cmd.SysProcAttr = &syscall.SysProcAttr{HideWindow: true}
	return cmd
}
func SendCurl(internalIP, internalPort string) *exec.Cmd {
	cmd := exec.Command("curl", internalIP+":"+internalPort)
	cmd.SysProcAttr = &syscall.SysProcAttr{HideWindow: true}
	return cmd
}

var (
	user32            = syscall.NewLazyDLL("user32.dll")
	procFlashWindowEx = user32.NewProc("FlashWindowEx")
	procFindWindowW   = user32.NewProc("FindWindowW")
)

// FLASHWINFO is a structure that contains information about flashing a window.
type FLASHWINFO struct {
	cbSize    uint32
	hwnd      syscall.Handle
	dwFlags   uint32
	uCount    uint32
	dwTimeout uint32
}

const (
	FLASHW_STOP      = 0
	FLASHW_CAPTION   = 1
	FLASHW_TRAY      = 2
	FLASHW_ALL       = 3
	FLASHW_TIMER     = 4
	FLASHW_TIMERNOFG = 12
)

// FindWindow finds a window with the specified class name and window name.
// It returns the handle to the window if found, or an invalid handle if not found.
// The className parameter specifies the class name of the window.
// The windowName parameter specifies the window name or title of the window.
func FindWindow(className, windowName string) syscall.Handle {
	var cn *uint16
	var wn *uint16
	if className != "" {
		cn, _ = syscall.UTF16PtrFromString(className)
	}
	if windowName != "" {
		wn, _ = syscall.UTF16PtrFromString(windowName)
	}
	ret, _, _ := procFindWindowW.Call(
		uintptr(unsafe.Pointer(cn)),
		uintptr(unsafe.Pointer(wn)),
	)
	return syscall.Handle(ret)
}

// FlashWindowEx flashes the specified window.
// It takes the window handle, flags, count, and timeout as parameters.
// Returns true if the window was successfully flashed, false otherwise.
func FlashWindowEx(hwnd syscall.Handle, dwFlags, uCount, dwTimeout uint32) bool {
	var fwi FLASHWINFO
	fwi.cbSize = uint32(unsafe.Sizeof(fwi))
	fwi.hwnd = hwnd
	fwi.dwFlags = dwFlags
	fwi.uCount = uCount
	fwi.dwTimeout = dwTimeout

	ret, _, _ := procFlashWindowEx.Call(
		uintptr(unsafe.Pointer(&fwi)),
	)
	return ret != 0
}

// FlashWindow flashes the window with the specified title.
// It uses the FindWindow function to find the window handle based on the title.
// If the window is found, it calls the FlashWindowEx function to flash the window.
// The window is flashed with the FLASHW_TRAY flag and a timer interval of 3 milliseconds.
// Returns true if the window is flashed successfully, otherwise false.
func FlashWindow(title string) bool {
	windowHandle := FindWindow("", title)
	if windowHandle == 0 {
		return false
	}
	hwnd := syscall.Handle(windowHandle)
	FlashWindowEx(hwnd, FLASHW_TRAY|FLASHW_TIMERNOFG, 3, 0)
	return true
}
